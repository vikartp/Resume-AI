"use client";

import { FileText, Sparkles, Download, MessageSquare, Zap, Shield, ArrowRight } from "lucide-react";
import { getLoginUrl, isAuthenticated } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col overflow-hidden relative">
      {/* Animated background orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl btn-primary flex items-center justify-center">
            <Sparkles size={18} className="text-white relative z-10" />
          </div>
          <span className="text-xl font-bold">ResumeAI</span>
        </div>
        <a
          href={getLoginUrl()}
          className="glass rounded-full px-5 py-2.5 text-sm font-medium hover:bg-[var(--accent)] transition-all hover:glow-sm flex items-center gap-2"
        >
          Sign In
          <ArrowRight size={14} />
        </a>
      </nav>

      {/* Hero */}
      <header className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="mb-8 animate-[float_6s_ease-in-out_infinite]">
          <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2.5 text-sm font-medium glow-sm">
            <Zap size={14} className="text-[var(--primary)]" />
            <span className="gradient-text font-semibold">AI-Powered Resume Builder</span>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
          Land Your Dream Job
          <br />
          <span className="gradient-text">with ResumeAI</span>
        </h1>

        <p className="text-lg md:text-xl text-[var(--muted-foreground)] max-w-2xl mb-12 leading-relaxed">
          Paste a job description, upload your resume, and let AI generate an ATS-optimized
          resume tailored specifically for the role.
        </p>

        <a
          href={getLoginUrl()}
          className="group relative inline-flex items-center gap-4 bg-white text-gray-700 px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5 border border-gray-200"
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Continue with Google</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </a>

        {/* Features */}
        <div className="grid md:grid-cols-4 gap-5 mt-24 max-w-5xl w-full">
          {[
            { icon: FileText, title: "Paste JD", desc: "Drop in any job description" },
            { icon: Sparkles, title: "AI Tailors", desc: "Resume rewritten by GPT-4o" },
            { icon: Download, title: "PDF Ready", desc: "ATS-friendly instant download" },
            { icon: MessageSquare, title: "Interview Prep", desc: "AI coaching for the role" },
          ].map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="glass rounded-2xl p-6 text-center group hover:glow transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--accent)] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Icon size={22} className="text-[var(--primary)]" />
              </div>
              <h3 className="font-semibold mb-1.5">{title}</h3>
              <p className="text-sm text-[var(--muted-foreground)]">{desc}</p>
            </div>
          ))}
        </div>
      </header>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-sm text-[var(--muted-foreground)]">
        <div className="flex items-center justify-center gap-2">
          <Shield size={14} />
          <span>Your data stays private</span>
          <span className="mx-2">·</span>
          <span>Built with AI</span>
        </div>
      </footer>
    </div>
  );
}
