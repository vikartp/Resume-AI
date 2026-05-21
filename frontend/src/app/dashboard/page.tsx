"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  FileText,
  Sparkles,
  Loader2,
  LogOut,
  Sun,
  Moon,
  History,
  MessageSquare,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/lib/useAuth";
import { apiPost, getLoginUrl } from "@/lib/api";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const [jobDescription, setJobDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [experienceDescription, setExperienceDescription] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setResumeFile(acceptedFiles[0]);
      setError("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      setError("Please paste a job description");
      return;
    }
    if (!resumeFile) {
      setError("Please upload your existing resume");
      return;
    }

    setError("");
    setGenerating(true);

    try {
      const formData = new FormData();
      formData.append("job_description", jobDescription);
      formData.append("skills", skills);
      formData.append("experience_description", experienceDescription);
      formData.append("resume_file", resumeFile);

      const result = await apiPost<{ session_id: string }>("/api/resume/generate", formData);
      router.push(`/result/${result.session_id}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <Loader2 className="animate-spin text-[var(--primary)]" size={32} />
      </div>
    );
  }

  if (!user) {
    if (typeof window !== "undefined") {
      window.location.href = getLoginUrl();
    }
    return null;
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-[var(--background)] relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb orb-1 opacity-20"></div>
      <div className="orb orb-2 opacity-20"></div>

      {/* Header */}
      <header className="relative z-10 glass-strong shrink-0">
        <div className="w-full px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl btn-primary flex items-center justify-center">
              <Sparkles size={16} className="text-white relative z-10" />
            </div>
            <h1 className="text-xl font-bold gradient-text">ResumeAI</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/history")}
              className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-all glass rounded-lg px-3 py-2 hover:glow-sm"
            >
              <History size={15} />
              History
            </button>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2.5 rounded-lg glass hover:glow-sm transition-all"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <div className="flex items-center gap-2 glass rounded-full pl-1 pr-3 py-1">
              {user.picture && (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-7 h-7 rounded-full ring-2 ring-[var(--primary)]/30"
                  referrerPolicy="no-referrer"
                />
              )}
              <span className="text-sm font-medium">{user.name}</span>
            </div>
            <button
              onClick={logout}
              className="p-2.5 rounded-lg glass text-[var(--muted-foreground)] hover:text-[var(--destructive)] transition-all"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col overflow-y-auto px-8 py-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-1">
            Generate <span className="gradient-text">Tailored Resume</span>
          </h2>
          <p className="text-[var(--muted-foreground)]">
            Paste the job description, upload your resume, and let AI craft an ATS-optimized resume.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 flex-1 min-h-0">
          {/* Left Column - Inputs */}
          <div className="flex flex-col gap-5">
            {/* Job Description */}
            <div className="glass rounded-2xl p-5 glow-sm flex-1 flex flex-col">
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <FileText size={15} className="text-[var(--primary)]" />
                Job Description <span className="text-[var(--destructive)]">*</span>
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                className="w-full flex-1 min-h-[120px] px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)]/50 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] resize-none focus:outline-none input-glow transition-all"
              />
            </div>

            {/* Resume Upload */}
            <div className="glass rounded-2xl p-5 glow-sm">
              <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
                <Upload size={15} className="text-[var(--primary)]" />
                Existing Resume <span className="text-[var(--destructive)]">*</span>
              </label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive
                    ? "border-[var(--primary)] bg-[var(--accent)] glow"
                    : resumeFile
                    ? "border-[var(--primary)]/50 bg-[var(--accent)]"
                    : "border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--accent)]"
                }`}
              >
                <input {...getInputProps()} />
                {resumeFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                      <FileText size={20} className="text-[var(--primary)]" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">{resumeFile.name}</p>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {(resumeFile.size / 1024).toFixed(1)} KB · Click to replace
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-[var(--accent)] flex items-center justify-center mx-auto mb-4">
                      <Upload size={24} className="text-[var(--muted-foreground)]" />
                    </div>
                    <p className="font-semibold">Drop your resume here or click to browse</p>
                    <p className="text-sm text-[var(--muted-foreground)] mt-1">
                      PDF or DOCX, max 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Additional Context */}
          <div className="flex flex-col gap-5">
            {/* Skills */}
            <div className="glass rounded-2xl p-5 glow-sm flex-1 flex flex-col">
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <Sparkles size={15} className="text-[var(--primary)]" />
                Additional Skills
              </label>
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="List additional skills you want to highlight (e.g., Python, AWS, Leadership, Agile...)&#10;&#10;These will be considered alongside your resume when tailoring."
                className="w-full flex-1 min-h-[80px] px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)]/50 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] resize-none focus:outline-none input-glow transition-all"
              />
            </div>

            {/* Experience Description */}
            <div className="glass rounded-2xl p-5 glow-sm flex-1 flex flex-col">
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <MessageSquare size={15} className="text-[var(--primary)]" />
                Additional Experience / Context
              </label>
              <textarea
                value={experienceDescription}
                onChange={(e) => setExperienceDescription(e.target.value)}
                placeholder="Describe any recent experience, projects, or context not in your current resume...&#10;&#10;E.g., 'Led a team of 5 engineers to deliver a microservices migration project reducing latency by 40%'"
                className="w-full flex-1 min-h-[80px] px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)]/50 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] resize-none focus:outline-none input-glow transition-all"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full btn-primary flex items-center justify-center gap-3 py-4 rounded-2xl font-semibold text-lg shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
            >
              {generating ? (
                <>
                  <Loader2 size={20} className="animate-spin relative z-10" />
                  <span className="relative z-10">Generating your tailored resume...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} className="relative z-10" />
                  <span className="relative z-10">Generate Tailored Resume</span>
                </>
              )}
            </button>

            {error && (
              <div className="glass rounded-xl p-4 border-[var(--destructive)]/30 border">
                <p className="text-[var(--destructive)] text-sm text-center">{error}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
