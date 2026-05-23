import logging
import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from app.config import SECRET_KEY, FRONTEND_URL
from app.db.database import init_db
from app.api.auth import router as auth_router
from app.api.resume import router as resume_router

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-7s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("resumeai")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting ResumeAI backend...")
    await init_db()
    logger.info("Database initialized")
    yield
    logger.info("Shutting down ResumeAI backend")


app = FastAPI(
    title="ResumeAI",
    description="AI-driven resume builder tailored for job descriptions",
    version="1.0.0",
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


# Request timing middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = round((time.time() - start) * 1000)
    if not request.url.path.startswith("/api/health"):
        logger.info(f"{request.method} {request.url.path} → {response.status_code} ({duration}ms)")
    return response


# Routers
app.include_router(auth_router)
app.include_router(resume_router)


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "ResumeAI", "version": "1.0.0"}
