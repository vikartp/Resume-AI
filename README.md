<div align="center">

# ✨ ResumeAI

### AI-Powered Resume Builder That Lands Interviews

[![Python](https://img.shields.io/badge/Python-3.12+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![OpenAI](https://img.shields.io/badge/GPT--4o-Powered-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

**Paste a job description. Upload your resume. Get an ATS-optimized, tailored resume in seconds.**

[Get Started](#-quick-start) · [Features](#-features) · [Architecture](#-architecture) · [API Reference](#-api-reference) · [Contributing](#-contributing)

</div>

---

## 🎯 The Problem

Job seekers spend **hours** manually tailoring resumes for each application. Most resumes get rejected by Applicant Tracking Systems (ATS) before a human ever sees them. Generic resumes don't highlight the right keywords, skills, or experiences for specific roles.

## 💡 The Solution

**ResumeAI** uses GPT-4o to analyze job descriptions and intelligently rewrite your resume with:

- ✅ **ATS-optimized keywords** extracted from the job description
- ✅ **Restructured experience** prioritized by relevance to the role
- ✅ **Quantified achievements** reworded to match JD requirements
- ✅ **ATS compatibility scoring** so you know your resume passes the filters
- ✅ **Interview preparation** coaching tailored to the specific role

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| 🔐 **Google OAuth** | Secure one-click authentication with Google accounts |
| 📋 **Smart JD Analysis** | Paste any job description — AI extracts requirements, keywords, and priorities |
| 📄 **Resume Parsing** | Upload PDF or DOCX — we extract and understand your experience |
| 🤖 **AI Resume Generation** | GPT-4o generates an ATS-optimized resume tailored to the JD |
| 📊 **ATS Score** | Real-time compatibility scoring (0-100) with keyword match breakdown |
| 📥 **PDF Download** | Clean, professional, ATS-parseable PDF output |
| 📝 **Multiple Formats** | Structured preview, formatted text, and raw JSON output |
| 🎤 **Interview Prep** | AI-generated interview guidance with predicted questions and STAR stories |
| 📚 **Session History** | Revisit, search, and manage all past resume generations |
| 🌗 **Dark/Light Mode** | Elegant glassmorphism UI with theme toggle |
| 📱 **Fully Responsive** | Works beautifully on desktop, tablet, and mobile |

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────┐
│                      Frontend (Next.js 15)               │
│  ┌──────────┐  ┌──────────┐  ┌─────────┐  ┌──────────┐  │
│  │ Landing  │  │Dashboard │  │ Result  │  │ History  │  │
│  │  Page    │  │  Page    │  │  Page   │  │  Page    │  │
│  └──────────┘  └──────────┘  └─────────┘  └──────────┘  │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Shared: Navbar · AuthLayout · Toast · ThemeProvider  │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────┬─────────────────────────────────┘
                         │ REST API
┌────────────────────────┴─────────────────────────────────┐
│                      Backend (FastAPI)                    │
│  ┌──────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │Auth API  │  │ Resume API   │  │ Request Middleware  │  │
│  │(OAuth)   │  │ (CRUD+Gen)   │  │ (Logging+Timing)   │  │
│  └──────────┘  └──────────────┘  └────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐ │
│  │Services: AI Engine · PDF Generator · Resume Parser   │ │
│  └──────────────────────────────────────────────────────┘ │
│  ┌──────────┐  ┌──────────────┐                          │
│  │ SQLite   │  │   OpenAI     │                          │
│  │(SQLModel)│  │  GPT-4o API  │                          │
│  └──────────┘  └──────────────┘                          │
└──────────────────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 15, React 19, TypeScript | App framework with SSR |
| **Styling** | Tailwind CSS 4 + Custom CSS | Glassmorphism design system |
| **Backend** | Python 3.12+, FastAPI | Async REST API |
| **AI** | OpenAI GPT-4o | Resume generation, ATS scoring, interview prep |
| **Auth** | Google OAuth 2.0 via Authlib | Secure authentication |
| **PDF** | fpdf2 | ATS-friendly PDF generation |
| **Database** | SQLite (async) + SQLModel | Data persistence |
| **Infra** | Docker + Docker Compose | One-command deployment |

---

## ⚡ Quick Start

### Prerequisites

| Requirement | Version |
|-------------|---------|
| Python | 3.12+ with [uv](https://docs.astral.sh/uv/) |
| Node.js | 20+ |
| Google OAuth | [Create credentials](https://console.cloud.google.com/apis/credentials) |
| OpenAI API | [Get API key](https://platform.openai.com/api-keys) |

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/ResumeAI.git
cd ResumeAI
```

### 2️⃣ Start the Backend

```bash
cd backend

# Copy and fill environment variables
cp .env.example .env
# Edit .env with your API keys (see Environment Variables section below)

# Install dependencies and start
uv sync
uv run uvicorn app.main:app --reload --port 8000
```

### 3️⃣ Start the Frontend

```bash
cd frontend

# Copy and fill environment variables
cp .env.local.example .env.local

# Install and start
npm install
npm run dev
```

### 4️⃣ Open the App

Navigate to **http://localhost:3000** and sign in with Google.

### 🐳 Docker (One-Command Full Stack)

```bash
# Copy and fill environment variables
cp backend/.env.example .env
# Edit .env with your API keys

# Build and run everything
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | ✅ | Your OpenAI API key |
| `OPENAI_API_BASE` | ❌ | API base URL (default: `https://api.openai.com/v1`) |
| `CHAT_MODEL` | ❌ | Model name (default: `gpt-4o`) |
| `GOOGLE_CLIENT_ID` | ✅ | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | ✅ | Google OAuth Client Secret |
| `SECRET_KEY` | ✅ | Random secret for session signing |
| `FRONTEND_URL` | ❌ | Frontend URL (default: `http://localhost:3000`) |
| `DATABASE_URL` | ❌ | SQLite URL (default: `sqlite+aiosqlite:///./resumeai.db`) |

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | ✅ | Backend API URL (e.g., `http://localhost:8000`) |

---

## 🔑 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a project (or select existing)
3. Navigate to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
4. Choose **Web application**
5. Add authorized redirect URI: `http://localhost:8000/api/auth/callback`
6. Copy **Client ID** and **Client Secret** to your `backend/.env` file

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/auth/login` | Initiate Google OAuth flow |
| `GET` | `/api/auth/callback` | OAuth callback handler |
| `GET` | `/api/auth/me` | Get authenticated user profile |

### Resume Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/resume/generate` | Generate a tailored resume (multipart form) |
| `GET` | `/api/resume/history` | List user's resume history |
| `GET` | `/api/resume/{id}` | Get specific resume session |
| `GET` | `/api/resume/{id}/pdf` | Download resume as PDF |
| `POST` | `/api/resume/{id}/interview-guidance` | Generate interview prep guidance |
| `DELETE` | `/api/resume/{id}` | Delete a resume session |

### System

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |

> 💡 **Interactive API docs** available at `/docs` (Swagger UI) when the backend is running.

---

## 📁 Project Structure

```
ResumeAI/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth.py              # Google OAuth routes
│   │   │   └── resume.py            # Resume CRUD + generation routes
│   │   ├── models/
│   │   │   └── models.py            # User & ResumeSession models
│   │   ├── services/
│   │   │   ├── ai_engine.py         # GPT-4o resume gen + ATS scoring
│   │   │   ├── pdf_generator.py     # fpdf2 PDF output
│   │   │   └── resume_parser.py     # PDF/DOCX text extraction
│   │   ├── db/
│   │   │   └── database.py          # Async SQLite setup
│   │   ├── config.py                # Environment configuration
│   │   └── main.py                  # FastAPI app + middleware
│   ├── pyproject.toml
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx             # Landing page
│   │   │   ├── layout.tsx           # Root layout + SEO
│   │   │   ├── globals.css          # Design system + animations
│   │   │   ├── dashboard/page.tsx   # Resume generation form
│   │   │   ├── result/[id]/page.tsx # Result view + ATS score
│   │   │   ├── history/page.tsx     # Session history + search
│   │   │   └── auth/callback/       # OAuth callback handler
│   │   ├── components/
│   │   │   ├── Navbar.tsx           # Persistent navigation bar
│   │   │   ├── AuthLayout.tsx       # Shared authenticated layout
│   │   │   ├── Toast.tsx            # Toast notification system
│   │   │   ├── ConfirmDialog.tsx    # Confirmation modal
│   │   │   ├── ATSScore.tsx         # Circular ATS score ring
│   │   │   ├── ResumePreview.tsx    # Structured resume card
│   │   │   ├── SkeletonLoader.tsx   # Loading placeholders
│   │   │   └── ThemeProvider.tsx    # Theme + Toast providers
│   │   └── lib/
│   │       ├── api.ts              # API client (GET/POST/DELETE)
│   │       └── useAuth.ts          # Authentication hook
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 🔄 How It Works

```
User Flow:
┌─────────┐     ┌──────────┐     ┌─────────────┐     ┌───────────┐
│  Login   │────▶│ Paste JD │────▶│ Upload      │────▶│ Generate  │
│ (Google) │     │ + Skills │     │ Resume      │     │ (AI)      │
└─────────┘     └──────────┘     └─────────────┘     └─────┬─────┘
                                                           │
┌─────────────────────────────────────────────────────────┐ │
│                    AI Pipeline                          │ │
│  1. Parse uploaded resume (PDF/DOCX → text)             │◀┘
│  2. Analyze JD requirements & keywords                  │
│  3. Generate tailored resume (JSON + text)              │
│  4. Calculate ATS compatibility score (0-100)           │
│  5. Return structured result                            │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                    Result Page                          │
│  • Structured preview with skills tags & timeline       │
│  • ATS score with keyword breakdown                     │
│  • PDF download (ATS-friendly formatting)               │
│  • Text / JSON copy                                     │
│  • Interview prep generation                            │
└─────────────────────────────────────────────────────────┘
```

---

## 🤝 Contributing

Contributions are welcome! Here's how to get involved:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Tips

- Backend hot-reloads with `--reload` flag
- Frontend hot-reloads automatically with `npm run dev`
- API docs at `http://localhost:8000/docs`
- Delete `backend/resumeai.db` to reset the database

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ and AI**

⭐ Star this repo if you found it useful!

</div>
