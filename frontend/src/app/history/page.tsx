"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FileText, Loader2, Search, Trash2, ExternalLink, MessageSquare, Sparkles } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import ConfirmDialog from "@/components/ConfirmDialog";
import { HistorySkeleton } from "@/components/SkeletonLoader";
import { useToast } from "@/components/Toast";
import { useAuth } from "@/lib/useAuth";
import { apiGet, apiDelete, getLoginUrl } from "@/lib/api";

interface HistoryItem {
  id: string;
  job_description: string;
  created_at: string;
  has_guidance: boolean;
}

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = getLoginUrl();
      return;
    }
    if (user) {
      apiGet<HistoryItem[]>("/api/resume/history")
        .then(setHistory)
        .catch(() => showToast("Failed to load history", "error"))
        .finally(() => setLoading(false));
    }
  }, [user, authLoading]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return history;
    const q = searchQuery.toLowerCase();
    return history.filter((item) => item.job_description.toLowerCase().includes(q));
  }, [history, searchQuery]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiDelete(`/api/resume/${deleteTarget}`);
      setHistory((prev) => prev.filter((h) => h.id !== deleteTarget));
      showToast("Resume deleted", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to delete", "error");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <AuthLayout>
      <div className="max-w-5xl mx-auto px-6 md:px-8 py-6 w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">
              Resume <span className="gradient-text">History</span>
            </h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              {history.length} resume{history.length !== 1 ? "s" : ""} generated
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="btn-primary px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2"
          >
            <Sparkles size={14} className="relative z-10" />
            <span className="relative z-10">New Resume</span>
          </button>
        </div>

        {/* Search */}
        {history.length > 0 && (
          <div className="relative mb-5">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <input
              id="history-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by job description..."
              className="w-full pl-11 pr-4 py-3 rounded-xl glass border border-[var(--border)] text-sm focus:outline-none input-glow transition-all bg-transparent"
            />
          </div>
        )}

        {/* Content */}
        {loading ? (
          <HistorySkeleton count={4} />
        ) : history.length === 0 ? (
          <div className="text-center py-20 glass rounded-2xl animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-[var(--accent)] flex items-center justify-center mx-auto mb-4">
              <FileText size={28} className="text-[var(--muted-foreground)]" />
            </div>
            <h3 className="font-semibold text-lg mb-2">No resumes yet</h3>
            <p className="text-[var(--muted-foreground)] mb-6 text-sm">
              Generate your first AI-tailored resume to get started.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="btn-primary px-6 py-2.5 rounded-xl font-medium inline-flex items-center gap-2"
            >
              <Sparkles size={14} className="relative z-10" />
              <span className="relative z-10">Generate your first resume</span>
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 glass rounded-2xl animate-fade-in">
            <Search size={28} className="text-[var(--muted-foreground)] mx-auto mb-3" />
            <p className="text-[var(--muted-foreground)]">No results found for &ldquo;{searchQuery}&rdquo;</p>
          </div>
        ) : (
          <div className="space-y-3 animate-fade-in">
            {filtered.map((item, i) => (
              <div
                key={item.id}
                className="glass rounded-2xl p-5 hover:glow-sm transition-all duration-300 hover:-translate-y-0.5 group animate-fade-in-up"
                style={{ animationDelay: `${i * 50}ms`, animationFillMode: "backwards" }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent)] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <FileText size={18} className="text-[var(--primary)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => router.push(`/result/${item.id}`)}
                      className="text-left block w-full"
                    >
                      <p className="font-medium text-sm text-[var(--foreground)] mb-1 group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                        {item.job_description}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {new Date(item.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {item.has_guidance && (
                      <span className="text-xs bg-[var(--primary)]/10 text-[var(--primary)] px-2.5 py-1 rounded-full font-medium hidden sm:flex items-center gap-1">
                        <MessageSquare size={10} />
                        Prep
                      </span>
                    )}
                    <button
                      onClick={() => router.push(`/result/${item.id}`)}
                      className="p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--accent)] transition-all"
                      title="View resume"
                    >
                      <ExternalLink size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(item.id)}
                      className="p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--destructive)] hover:bg-[var(--destructive)]/10 transition-all"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Resume"
        message="This will permanently delete this resume session and all associated data including interview guidance. This action cannot be undone."
        confirmText={deleting ? "Deleting..." : "Delete"}
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AuthLayout>
  );
}
