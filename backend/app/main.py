from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from app.config import SECRET_KEY, FRONTEND_URL
from app.db.database import init_db
from app.api.auth import router as auth_router
from app.api.resume import router as resume_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title="ResumeAI",
    description="AI-driven resume builder tailored for job descriptions",
    version="0.1.0",
    lifespan=lifespan,
)

# Session middleware for OAuth flow
app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router)
app.include_router(resume_router)


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "ResumeAI"}
