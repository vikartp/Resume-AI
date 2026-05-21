"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/useAuth";
import { apiGet, getLoginUrl } from "@/lib/api";

interface HistoryItem {
  id: string;
  job_description: string;
  created_at: string;
  has_guidance: boolean;
}

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = getLoginUrl();
      return;
    }
    if (user) {
      apiGet<HistoryItem[]>("/api/resume/history")
        .then(setHistory)
        .finally(() => setLoading(false));
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <Loader2 className="animate-spin text-[var(--primary)]" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] relative overflow-hidden">
      <div className="orb orb-2 opacity-15"></div>

      <header className="relative z-10 glass-strong">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-all glass rounded-lg p-2 hover:glow-sm"
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-xl font-bold gradient-text">Resume History</h1>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        {history.length === 0 ? (
          <div className="text-center py-20 glass rounded-2xl">
            <div className="w-16 h-16 rounded-2xl bg-[var(--accent)] flex items-center justify-center mx-auto mb-4">
              <FileText size={28} className="text-[var(--muted-foreground)]" />
            </div>
            <p className="text-[var(--muted-foreground)] mb-4">No resumes generated yet.</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="btn-primary px-6 py-2.5 rounded-xl font-medium inline-flex items-center gap-2"
            >
              <span className="relative z-10">Generate your first resume</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => router.push(`/result/${item.id}`)}
                className="w-full text-left glass rounded-2xl p-5 hover:glow-sm transition-all duration-300 hover:-translate-y-0.5 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-[var(--foreground)] mb-1 group-hover:text-[var(--primary)] transition-colors">
                      {item.job_description}
                    </p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {new Date(item.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {item.has_guidance && (
                    <span className="text-xs bg-[var(--primary)]/10 text-[var(--primary)] px-3 py-1 rounded-full font-medium">
                      + Interview Prep
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
