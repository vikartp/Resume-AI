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
} from "lucide-react";
import { useAuth } from "@/lib/useAuth";
import { apiGet, apiPost, getLoginUrl } from "@/lib/api";

interface ResumeResult {
  id: string;
  job_description: string;
  resume_json: any;
  resume_text: string;
  interview_guidance: string | null;
  created_at: string;
}

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [result, setResult] = useState<ResumeResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"text" | "json" | "guidance">("text");
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
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = () => {
    const token = localStorage.getItem("resumeai_token");
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/resume/${id}/pdf`;
    // Fetch with auth header and download
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "Tailored_Resume.pdf";
        link.click();
        URL.revokeObjectURL(link.href);
      });
  };

  const handleGetGuidance = async () => {
    setGuidanceLoading(true);
    try {
      const data = await apiPost<{ guidance: string }>(`/api/resume/${id}/interview-guidance`);
      setResult((prev) => (prev ? { ...prev, interview_guidance: data.guidance } : prev));
      setActiveTab("guidance");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGuidanceLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <Loader2 className="animate-spin text-[var(--primary)]" size={32} />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <p className="text-[var(--destructive)] mb-4">{error || "Not found"}</p>
          <button onClick={() => router.push("/dashboard")} className="text-[var(--primary)]">
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb orb-1 opacity-15"></div>
      <div className="orb orb-2 opacity-15"></div>

      {/* Header */}
      <header className="relative z-10 glass-strong">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-all glass rounded-lg px-3 py-2 hover:glow-sm"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPdf}
              className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium"
            >
              <Download size={16} className="relative z-10" />
              <span className="relative z-10">Download PDF</span>
            </button>
            {!result.interview_guidance && (
              <button
                onClick={handleGetGuidance}
                disabled={guidanceLoading}
                className="flex items-center gap-2 glass px-4 py-2.5 rounded-xl font-medium hover:glow-sm transition-all disabled:opacity-50"
              >
                {guidanceLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <MessageSquare size={16} className="text-[var(--primary)]" />
                )}
                Interview Prep
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 glass rounded-xl p-1.5 w-fit">
          {[
            { key: "text" as const, label: "Formatted Text", icon: FileText },
            { key: "json" as const, label: "JSON Data", icon: Code },
            ...(result.interview_guidance
              ? [{ key: "guidance" as const, label: "Interview Prep", icon: MessageSquare }]
              : []),
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === key
                  ? "btn-primary glow-sm"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]"
              }`}
            >
              <Icon size={14} className={activeTab === key ? "relative z-10" : ""} />
              <span className={activeTab === key ? "relative z-10" : ""}>{label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="glass-strong rounded-2xl p-8 relative glow-sm">
          {/* Copy Button */}
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
            className="absolute top-5 right-5 flex items-center gap-1.5 text-sm glass rounded-lg px-3 py-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-all hover:glow-sm"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy"}
          </button>

          {activeTab === "text" && (
            <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-[var(--foreground)] pr-20">
              {result.resume_text}
            </div>
          )}

          {activeTab === "json" && (
            <pre className="overflow-x-auto text-sm font-mono text-[var(--foreground)] pr-20">
              {JSON.stringify(result.resume_json, null, 2)}
            </pre>
          )}

          {activeTab === "guidance" && result.interview_guidance && (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{result.interview_guidance}</ReactMarkdown>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
