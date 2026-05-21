import json
from openai import AsyncOpenAI
from app.config import OPENAI_API_KEY, OPENAI_API_BASE, CHAT_MODEL

client = AsyncOpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_API_BASE)

RESUME_GENERATION_PROMPT = """You are an expert resume writer and ATS optimization specialist.
Your task is to generate a new, ATS-friendly resume tailored to the provided job description.

You will be given:
1. A job description (JD) that the candidate wants to apply for
2. The candidate's existing resume content
3. Additional skills the candidate wants to highlight
4. Additional experience/context description

Guidelines:
- Tailor the resume specifically to match the job description keywords and requirements
- Use ATS-friendly formatting: clear section headers, standard fonts, no tables/graphics
- Include relevant keywords from the JD naturally in the resume
- Prioritize experiences and skills that directly relate to the JD
- Use strong action verbs and quantifiable achievements
- Keep it concise (ideally 1-2 pages worth of content)
- Structure: Contact Info, Professional Summary, Skills, Experience, Education, Certifications (if any)
- Ensure the professional summary directly addresses the JD requirements
- Reorder and emphasize skills/experiences based on JD relevance

Return a JSON object with this exact structure:
{
  "contact": {
    "name": "Full Name",
    "email": "email@example.com",
    "phone": "phone number",
    "linkedin": "linkedin url if available",
    "location": "City, State"
  },
  "professional_summary": "A 3-4 sentence summary tailored to the JD",
  "skills": {
    "technical": ["skill1", "skill2"],
    "soft": ["skill1", "skill2"],
    "tools": ["tool1", "tool2"]
  },
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "duration": "Start - End",
      "achievements": ["Achievement 1 with metrics", "Achievement 2"]
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "Institution Name",
      "year": "Year"
    }
  ],
  "certifications": ["Cert 1", "Cert 2"]
}"""

RESUME_TEXT_PROMPT = """You are an expert resume writer. Convert the following resume JSON into a clean, 
ATS-friendly plain text resume format. Use clear section headers with dividers, bullet points for 
achievements, and proper spacing. Make it look professional when copied into a text document.

Format it exactly as it would appear in a well-formatted plain text resume."""

INTERVIEW_GUIDANCE_PROMPT = """You are a senior career coach and interview preparation expert.
Based on the job description and the candidate's tailored resume, provide comprehensive interview 
preparation guidance.

Include:
1. **Key Topics to Prepare**: Main technical and behavioral areas likely to be covered
2. **Potential Questions**: 8-10 likely interview questions (mix of technical and behavioral)
3. **STAR Stories to Prepare**: Suggest 3-4 situations from their experience to frame as STAR stories
4. **Company Research Tips**: What to research about the role/company
5. **Questions to Ask the Interviewer**: 4-5 thoughtful questions
6. **Red Flags to Address**: Any gaps or concerns in the resume and how to address them
7. **Quick Tips**: Final actionable tips for interview day

Be specific to the JD and the candidate's background. Don't be generic."""


async def generate_resume(
    job_description: str,
    existing_resume_text: str,
    skills: str = "",
    experience_description: str = "",
) -> dict:
    """Generate a tailored resume JSON from inputs."""
    user_content = f"""## Job Description:
{job_description}

## Existing Resume:
{existing_resume_text}

## Additional Skills:
{skills if skills else "None provided"}

## Additional Experience/Context:
{experience_description if experience_description else "None provided"}"""

    response = await client.chat.completions.create(
        model=CHAT_MODEL,
        messages=[
            {"role": "system", "content": RESUME_GENERATION_PROMPT},
            {"role": "user", "content": user_content},
        ],
        response_format={"type": "json_object"},
        temperature=0.7,
    )

    resume_json = json.loads(response.choices[0].message.content)
    return resume_json


async def generate_resume_text(resume_json: dict) -> str:
    """Convert resume JSON to formatted plain text."""
    response = await client.chat.completions.create(
        model=CHAT_MODEL,
        messages=[
            {"role": "system", "content": RESUME_TEXT_PROMPT},
            {"role": "user", "content": json.dumps(resume_json, indent=2)},
        ],
        temperature=0.3,
    )

    return response.choices[0].message.content


async def generate_interview_guidance(
    job_description: str, resume_json: dict
) -> str:
    """Generate interview preparation guidance."""
    user_content = f"""## Job Description:
{job_description}

## Candidate's Tailored Resume:
{json.dumps(resume_json, indent=2)}"""

    response = await client.chat.completions.create(
        model=CHAT_MODEL,
        messages=[
            {"role": "system", "content": INTERVIEW_GUIDANCE_PROMPT},
            {"role": "user", "content": user_content},
        ],
        temperature=0.7,
    )

    return response.choices[0].message.content
