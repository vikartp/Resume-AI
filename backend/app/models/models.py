from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid


class User(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    email: str = Field(unique=True, index=True)
    name: str
    picture: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ResumeSession(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    user_id: str = Field(foreign_key="user.id", index=True)
    job_description: str
    original_resume_text: str
    skills: Optional[str] = None
    experience_description: Optional[str] = None
    generated_resume_json: Optional[str] = None
    generated_resume_text: Optional[str] = None
    interview_guidance: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
