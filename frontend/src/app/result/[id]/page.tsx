"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import {
  Download,
  FileText,
  Copy,
  Check,
  MessageSquare,
  Loader2,
  ArrowLeft,
  Sparkles,
  Code,
  Eye,
  RotateCcw,
} from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import ATSScore from "@/components/ATSScore";
import ResumePreview from "@/components/ResumePreview";
import { ResultSkeleton } from "@/components/SkeletonLoader";
import { useToast } from "@/components/Toast";
import { useAuth } from "@/lib/useAuth";
import { apiGet, apiPost, getLoginUrl } from "@/lib/api";

interface ResumeResult {
  id: string;
  job_description: string;
  resume_json: any;
  resume_text: string;
  interview_guidance: string | null;
  ats_score: number | null;
  ats_breakdown: string | null;
  created_at: string;
}

type TabKey = "preview" | "text" | "json" | "guidance";

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [result, setResult] = useState<ResumeResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("preview");
  const [copied, setCopied] = useState(false);
  const [guidanceLoading, setGuidanceLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = getLoginUrl();
      return;
    }
    if (user && id) {
      loadResult();
    }
  }, [user, authLoading, id]);

  const loadResult = async () => {
    try {
      const data = await apiGet<ResumeResult>(`/api/resume/${id}`);
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    showToast("Copied to clipboard", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = async () => {
    try {
      const token = localStorage.getItem("resumeai_token");
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/resume/${id}/pdf`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      const candidateName = result?.resume_json?.contact?.name?.replace(/\s+/g, "_") || "Resume";
      link.download = `${candidateName}_Tailored_Resume.pdf`;
      link.click();
      URL.revokeObjectURL(link.href);
      showToast("PDF downloaded successfully", "success");
    } catch {
      showToast("Failed to download PDF", "error");
    }
  };

  const handleGetGuidance = async () => {
    setGuidanceLoading(true);
    try {
      const data = await apiPost<{ guidance: string }>(`/api/resume/${id}/interview-guidance`);
      setResult((prev) => (prev ? { ...prev, interview_guidance: data.guidance } : prev));
      setActiveTab("guidance");
      showToast("Interview prep ready!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to generate guidance", "error");
    } finally {
      setGuidanceLoading(false);
    }
  };

  if (loading) {
    return (
      <AuthLayout>
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-8 w-full">
          <ResultSkeleton />
        </div>
      </AuthLayout>
    );
  }

  if (error || !result) {
    return (
      <AuthLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center glass rounded-2xl p-10 animate-fade-in">
            <p className="text-[var(--destructive)] mb-4 font-medium">{error || "Resume not found"}</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="btn-primary px-6 py-2.5 rounded-xl font-medium inline-flex items-center gap-2"
            >
              <span className="relative z-10">Go to Dashboard</span>
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  const tabs: { key: TabKey; label: string; icon: typeof FileText }[] = [
    { key: "preview", label: "Preview", icon: Eye },
    { key: "text", label: "Text", icon: FileText },
    { key: "json", label: "JSON", icon: Code },
    ...(result.interview_guidance
      ? [{ key: "guidance" as TabKey, label: "Interview Prep", icon: MessageSquare }]
      : []),
  ];

  return (
    <AuthLayout>
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-6 w-full flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-all glass rounded-lg px-3 py-2 hover:glow-sm"
              id="back-btn"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">New Resume</span>
            </button>
            <div>
              <h2 className="text-lg font-bold">Your <span className="gradient-text">Tailored Resume</span></h2>
              <p className="text-xs text-[var(--muted-foreground)]">
                Generated {new Date(result.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleDownloadPdf}
              id="download-pdf-btn"
              className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
            >
              <Download size={15} className="relative z-10" />
              <span className="relative z-10">Download PDF</span>
            </button>
            {!result.interview_guidance && (
              <button
                onClick={handleGetGuidance}
                disabled={guidanceLoading}
                id="interview-prep-btn"
                className="flex items-center gap-2 glass px-4 py-2.5 rounded-xl text-sm font-medium hover:glow-sm transition-all disabled:opacity-50"
              >
                {guidanceLoading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <MessageSquare size={15} className="text-[var(--primary)]" />
                )}
                Interview Prep
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
          {/* ATS Score sidebar */}
          {result.ats_score !== null && result.ats_score !== undefined && (
            <div className="lg:w-48 flex-shrink-0">
              <div className="glass-strong rounded-2xl p-5 glow-sm text-center lg:sticky lg:top-6">
                <ATSScore score={result.ats_score} size={110} />
                <p className="text-xs text-[var(--muted-foreground)] mt-3 leading-relaxed">
                  ATS Match Score based on keyword alignment with the job description.
                </p>
              </div>
            </div>
          )}

          {/* Main content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Tabs */}
            <div className="flex gap-1 mb-5 glass rounded-xl p-1 w-fit">
              {tabs.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  id={`tab-${key}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === key
                      ? "btn-primary glow-sm"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]"
                  }`}
                >
                  <Icon size={14} className={activeTab === key ? "relative z-10" : ""} />
                  <span className={`hidden sm:inline ${activeTab === key ? "relative z-10" : ""}`}>{label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="glass-strong rounded-2xl p-6 md:p-8 relative glow-sm flex-1 overflow-auto animate-fade-in" key={activeTab}>
              {/* Copy Button */}
              {activeTab !== "preview" && (
                <button
                  onClick={() =>
                    handleCopy(
                      activeTab === "json"
                        ? JSON.stringify(result.resume_json, null, 2)
                        : activeTab === "guidance"
                        ? result.interview_guidance || ""
                        : result.resume_text
                    )
                  }
                  id="copy-btn"
                  className="absolute top-4 right-4 flex items-center gap-1.5 text-xs glass rounded-lg px-3 py-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-all hover:glow-sm z-10"
                >
                  {copied ? <Check size={13} className="text-[var(--success)]" /> : <Copy size={13} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              )}

              {activeTab === "preview" && result.resume_json && (
                <ResumePreview data={result.resume_json} />
              )}

              {activeTab === "text" && (
                <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-[var(--foreground)] pr-16">
                  {result.resume_text}
                </div>
              )}

              {activeTab === "json" && (
                <pre className="overflow-x-auto text-sm font-mono text-[var(--foreground)] pr-16">
                  {JSON.stringify(result.resume_json, null, 2)}
                </pre>
              )}

              {activeTab === "guidance" && result.interview_guidance && (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{result.interview_guidance}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
