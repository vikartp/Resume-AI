"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  FileText,
  Sparkles,
  Loader2,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  Trash2,
} from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { useToast } from "@/components/Toast";
import { apiPost } from "@/lib/api";

const steps = [
  { label: "Paste JD", icon: FileText },
  { label: "Upload Resume", icon: Upload },
  { label: "Generate", icon: Sparkles },
];

const generatingSteps = [
  "Parsing your resume...",
  "Analyzing job description...",
  "Matching skills & keywords...",
  "Generating tailored resume...",
  "Formatting & optimizing...",
];

export default function DashboardPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [jobDescription, setJobDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [experienceDescription, setExperienceDescription] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState(0);
  const [error, setError] = useState("");

  const currentStep = jobDescription.trim() ? (resumeFile ? 2 : 1) : 0;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setResumeFile(acceptedFiles[0]);
      setError("");
      showToast(`${acceptedFiles[0].name} uploaded successfully`, "success");
    }
  }, [showToast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      setError("Please paste a job description");
      showToast("Please paste a job description", "warning");
      return;
    }
    if (!resumeFile) {
      setError("Please upload your existing resume");
      showToast("Please upload your existing resume", "warning");
      return;
    }

    setError("");
    setGenerating(true);
    setGenStep(0);

    // Simulate progress steps
    const interval = setInterval(() => {
      setGenStep((prev) => {
        if (prev < generatingSteps.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 3000);

    try {
      const formData = new FormData();
      formData.append("job_description", jobDescription);
      formData.append("skills", skills);
      formData.append("experience_description", experienceDescription);
      formData.append("resume_file", resumeFile);

      const result = await apiPost<{ session_id: string }>("/api/resume/generate", formData);
      clearInterval(interval);
      showToast("Resume generated successfully!", "success");
      router.push(`/result/${result.session_id}`);
    } catch (err: any) {
      clearInterval(interval);
      setError(err.message || "Something went wrong");
      showToast(err.message || "Failed to generate resume", "error");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <AuthLayout>
      <div className="max-w-7xl mx-auto w-full px-6 md:px-8 py-6 flex-1 flex flex-col min-h-0">
        {/* Header + Progress */}
        <div className="mb-5">
          <h2 className="text-2xl font-bold mb-1">
            Generate <span className="gradient-text">Tailored Resume</span>
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] mb-5">
            Paste the job description, upload your resume, and let AI craft an ATS-optimized resume.
          </p>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-1">
            {steps.map(({ label, icon: Icon }, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  i < currentStep
                    ? "bg-[var(--success)]/10 text-[var(--success)]"
                    : i === currentStep
                    ? "bg-[var(--primary)]/10 text-[var(--primary)] glow-sm"
                    : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                }`}>
                  {i < currentStep ? <CheckCircle size={13} /> : <Icon size={13} />}
                  <span className="hidden sm:inline">{label}</span>
                </div>
                {i < steps.length - 1 && (
                  <ArrowRight size={12} className="text-[var(--muted-foreground)]" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Generating overlay */}
        {generating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]/80 backdrop-blur-sm">
            <div className="glass-strong rounded-3xl p-10 max-w-md text-center glow animate-scale-in">
              <div className="w-16 h-16 rounded-2xl btn-primary flex items-center justify-center mx-auto mb-6 pulse-glow">
                <Loader2 size={24} className="animate-spin text-white relative z-10" />
              </div>
              <h3 className="text-lg font-bold mb-6">Generating Your Resume</h3>
              <div className="space-y-3 text-left">
                {generatingSteps.map((step, i) => (
                  <div key={i} className={`flex items-center gap-3 text-sm transition-all duration-500 ${
                    i < genStep
                      ? "text-[var(--success)]"
                      : i === genStep
                      ? "text-[var(--foreground)]"
                      : "text-[var(--muted-foreground)] opacity-40"
                  }`}>
                    {i < genStep ? (
                      <CheckCircle size={16} className="flex-shrink-0" />
                    ) : i === genStep ? (
                      <Loader2 size={16} className="animate-spin flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-[var(--border)] flex-shrink-0" />
                    )}
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-5 flex-1 min-h-0">
          {/* Left Column - Inputs */}
          <div className="flex flex-col gap-4">
            {/* Job Description */}
            <div className="glass rounded-2xl p-5 glow-sm flex-1 flex flex-col">
              <label className="block text-sm font-semibold mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText size={15} className="text-[var(--primary)]" />
                  Job Description <span className="text-[var(--destructive)]">*</span>
                </span>
                <span className={`text-xs font-normal ${jobDescription.length > 5000 ? "text-[var(--destructive)]" : "text-[var(--muted-foreground)]"}`}>
                  {jobDescription.length.toLocaleString()} chars
                </span>
              </label>
              <textarea
                id="jd-input"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here...&#10;&#10;Include the role title, responsibilities, requirements, and preferred qualifications for best results."
                className="w-full flex-1 min-h-[120px] px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)]/50 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] resize-none focus:outline-none input-glow transition-all text-sm"
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
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive
                    ? "border-[var(--primary)] bg-[var(--accent)] glow"
                    : resumeFile
                    ? "border-[var(--primary)]/50 bg-[var(--accent)]"
                    : "border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--accent)]"
                }`}
              >
                <input {...getInputProps()} id="resume-upload" />
                {resumeFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                      <FileText size={20} className="text-[var(--primary)]" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-sm">{resumeFile.name}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {(resumeFile.size / 1024).toFixed(1)} KB · Click to replace
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setResumeFile(null);
                      }}
                      className="p-2 rounded-lg hover:bg-[var(--destructive)]/10 text-[var(--muted-foreground)] hover:text-[var(--destructive)] transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[var(--accent)] flex items-center justify-center mx-auto mb-3">
                      <Upload size={22} className="text-[var(--muted-foreground)]" />
                    </div>
                    <p className="font-semibold text-sm">Drop your resume here or click to browse</p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">
                      PDF or DOCX, max 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Additional Context */}
          <div className="flex flex-col gap-4">
            {/* Skills */}
            <div className="glass rounded-2xl p-5 glow-sm flex-1 flex flex-col">
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <Sparkles size={15} className="text-[var(--primary)]" />
                Additional Skills
                <span className="text-xs font-normal text-[var(--muted-foreground)]">(optional)</span>
              </label>
              <textarea
                id="skills-input"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="List additional skills you want to highlight...&#10;&#10;e.g., Python, AWS, Leadership, Agile, System Design"
                className="w-full flex-1 min-h-[80px] px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)]/50 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] resize-none focus:outline-none input-glow transition-all text-sm"
              />
            </div>

            {/* Experience Description */}
            <div className="glass rounded-2xl p-5 glow-sm flex-1 flex flex-col">
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <MessageSquare size={15} className="text-[var(--primary)]" />
                Additional Experience
                <span className="text-xs font-normal text-[var(--muted-foreground)]">(optional)</span>
              </label>
              <textarea
                id="experience-input"
                value={experienceDescription}
                onChange={(e) => setExperienceDescription(e.target.value)}
                placeholder="Describe experience not in your current resume...&#10;&#10;e.g., 'Led a team of 5 engineers to deliver a microservices migration reducing latency by 40%'"
                className="w-full flex-1 min-h-[80px] px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)]/50 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] resize-none focus:outline-none input-glow transition-all text-sm"
              />
            </div>

            {/* Generate Button */}
            <button
              id="generate-btn"
              onClick={handleGenerate}
              disabled={generating}
              className="w-full btn-primary flex items-center justify-center gap-3 py-4 rounded-2xl font-semibold text-lg shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
            >
              <Sparkles size={20} className="relative z-10" />
              <span className="relative z-10">Generate Tailored Resume</span>
            </button>

            {error && (
              <div className="glass rounded-xl p-3 border-[var(--destructive)]/30 border animate-fade-in">
                <p className="text-[var(--destructive)] text-sm text-center">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
