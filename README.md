# ResumeAI — AI-Powered Resume Builder

An AI-driven solution that generates ATS-friendly resumes tailored to specific job descriptions using your existing resume, skills, and experience context.

## Features

- **Google OAuth Login** — Secure authentication with Google accounts
- **JD Paste & Resume Upload** — Paste job descriptions and drop existing resume (PDF/DOCX)
- **AI Resume Generation** — GPT-4o generates an ATS-optimized resume targeting the JD
- **PDF Download** — Clean, professional PDF output with ATS-friendly formatting
- **Text & JSON Output** — Copy formatted text or structured JSON
- **Interview Prep** — AI generates interview guidance specific to the role
- **History** — View and revisit past resume generations

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.12+, FastAPI, OpenAI GPT-4o |
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS 4 |
| Auth | Google OAuth 2.0 via Authlib |
| PDF | WeasyPrint with Jinja2 HTML templates |
| Database | SQLite (async) with SQLModel ORM |
| Infra | Docker + Docker Compose |

## Quick Start

### Prerequisites

- Python 3.12+ with [uv](https://docs.astral.sh/uv/)
- Node.js 20+
- Google OAuth credentials ([setup guide](https://console.cloud.google.com/apis/credentials))
- OpenAI API key

### Backend

```bash
cd backend
cp .env.example .env
# Fill in OPENAI_API_KEY, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SECRET_KEY

uv sync
uv run uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8000

npm install
npm run dev
```

### Docker (Full Stack)

```bash
cp backend/.env.example .env
# Fill in secrets in .env

docker compose up --build
```

App runs at http://localhost:3000, API at http://localhost:8000.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/login` | Initiate Google OAuth |
| GET | `/api/auth/callback` | OAuth callback |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/resume/generate` | Generate tailored resume |
| GET | `/api/resume/{id}/pdf` | Download PDF |
| POST | `/api/resume/{id}/interview-guidance` | Get interview prep |
| GET | `/api/resume/history` | User's generation history |
| GET | `/api/resume/{id}` | Get specific session |
| GET | `/api/health` | Health check |

## How It Works

1. User logs in with Google
2. Pastes a job description and uploads existing resume
3. Optionally adds extra skills and experience context
4. AI analyzes the JD and existing resume
5. Generates a new ATS-friendly resume with:
   - Tailored professional summary
   - JD-relevant skill prioritization
   - Reworded achievements matching JD keywords
   - Proper section formatting
6. User downloads PDF or copies text/JSON
7. Can request AI interview preparation guidance

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 Client ID (Web application)
3. Add authorized redirect URI: `http://localhost:8000/api/auth/callback`
4. Copy Client ID and Secret to `.env`

## Project Structure

```
ResumeAI/
├── backend/
│   ├── app/
│   │   ├── api/           # Auth & Resume API routes
│   │   ├── models/        # SQLModel data models
│   │   ├── services/      # AI engine, PDF gen, resume parser
│   │   ├── db/            # Database setup
│   │   ├── config.py      # Environment config
│   │   └── main.py        # FastAPI app
│   ├── pyproject.toml
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/           # Next.js pages (dashboard, result, history)
│   │   ├── components/    # Shared components
│   │   └── lib/           # API client, auth hook
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```
