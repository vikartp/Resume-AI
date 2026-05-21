import json
import tempfile
import os
from fastapi import APIRouter, HTTPException, Request, UploadFile, File, Form
from fastapi.responses import Response
from sqlmodel import select
from app.db.database import async_session
from app.models.models import ResumeSession
from app.services.resume_parser import extract_resume_text
from app.services.ai_engine import generate_resume, generate_resume_text, generate_interview_guidance
from app.services.pdf_generator import generate_resume_pdf
from app.api.auth import verify_token

router = APIRouter(prefix="/api/resume", tags=["resume"])


def get_user_id_from_request(request: Request) -> str:
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = auth_header.split(" ")[1]
    data = verify_token(token)
    if not data:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return data["user_id"]


@router.post("/generate")
async def generate_tailored_resume(
    request: Request,
    job_description: str = Form(...),
    skills: str = Form(""),
    experience_description: str = Form(""),
    resume_file: UploadFile = File(...),
):
    """Generate a tailored resume from JD, existing resume, and additional context."""
    user_id = get_user_id_from_request(request)

    # Validate file type
    if not resume_file.filename.lower().endswith((".pdf", ".docx")):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")

    # Save uploaded file temporarily and extract text
    suffix = os.path.splitext(resume_file.filename)[1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        content = await resume_file.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        resume_text = await extract_resume_text(tmp_path, resume_file.filename)
    finally:
        os.unlink(tmp_path)

    # Generate tailored resume using AI
    resume_json = await generate_resume(
        job_description=job_description,
        existing_resume_text=resume_text,
        skills=skills,
        experience_description=experience_description,
    )

    # Generate plain text version
    resume_text_formatted = await generate_resume_text(resume_json)

    # Save session
    async with async_session() as session:
        resume_session = ResumeSession(
            user_id=user_id,
            job_description=job_description,
            original_resume_text=resume_text,
            skills=skills,
            experience_description=experience_description,
            generated_resume_json=json.dumps(resume_json),
            generated_resume_text=resume_text_formatted,
        )
        session.add(resume_session)
        await session.commit()
        await session.refresh(resume_session)

    return {
        "session_id": resume_session.id,
        "resume_json": resume_json,
        "resume_text": resume_text_formatted,
    }


@router.get("/{session_id}/pdf")
async def download_resume_pdf(session_id: str, request: Request):
    """Download the generated resume as PDF."""
    user_id = get_user_id_from_request(request)

    async with async_session() as session:
        stmt = select(ResumeSession).where(
            ResumeSession.id == session_id,
            ResumeSession.user_id == user_id,
        )
        result = await session.execute(stmt)
        resume_session = result.scalar_one_or_none()

    if not resume_session:
        raise HTTPException(status_code=404, detail="Resume session not found")

    resume_json = json.loads(resume_session.generated_resume_json)
    pdf_bytes = generate_resume_pdf(resume_json)

    candidate_name = resume_json.get("contact", {}).get("name", "Resume").replace(" ", "_")
    filename = f"{candidate_name}_Tailored_Resume.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.post("/{session_id}/interview-guidance")
async def get_interview_guidance(session_id: str, request: Request):
    """Generate interview preparation guidance for a resume session."""
    user_id = get_user_id_from_request(request)

    async with async_session() as session:
        stmt = select(ResumeSession).where(
            ResumeSession.id == session_id,
            ResumeSession.user_id == user_id,
        )
        result = await session.execute(stmt)
        resume_session = result.scalar_one_or_none()

    if not resume_session:
        raise HTTPException(status_code=404, detail="Resume session not found")

    resume_json = json.loads(resume_session.generated_resume_json)
    guidance = await generate_interview_guidance(
        job_description=resume_session.job_description,
        resume_json=resume_json,
    )

    # Save guidance to session
    async with async_session() as session:
        resume_session.interview_guidance = guidance
        session.add(resume_session)
        await session.commit()

    return {"guidance": guidance}


@router.get("/history")
async def get_resume_history(request: Request):
    """Get user's resume generation history."""
    user_id = get_user_id_from_request(request)

    async with async_session() as session:
        stmt = (
            select(ResumeSession)
            .where(ResumeSession.user_id == user_id)
            .order_by(ResumeSession.created_at.desc())
        )
        result = await session.execute(stmt)
        sessions = result.scalars().all()

    return [
        {
            "id": s.id,
            "job_description": s.job_description[:100] + "..." if len(s.job_description) > 100 else s.job_description,
            "created_at": s.created_at.isoformat(),
            "has_guidance": s.interview_guidance is not None,
        }
        for s in sessions
    ]


@router.get("/{session_id}")
async def get_resume_session(session_id: str, request: Request):
    """Get a specific resume session."""
    user_id = get_user_id_from_request(request)

    async with async_session() as session:
        stmt = select(ResumeSession).where(
            ResumeSession.id == session_id,
            ResumeSession.user_id == user_id,
        )
        result = await session.execute(stmt)
        resume_session = result.scalar_one_or_none()

    if not resume_session:
        raise HTTPException(status_code=404, detail="Resume session not found")

    return {
        "id": resume_session.id,
        "job_description": resume_session.job_description,
        "resume_json": json.loads(resume_session.generated_resume_json) if resume_session.generated_resume_json else None,
        "resume_text": resume_session.generated_resume_text,
        "interview_guidance": resume_session.interview_guidance,
        "created_at": resume_session.created_at.isoformat(),
    }
