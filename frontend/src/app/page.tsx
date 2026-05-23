"use client";

import { useState, useEffect, useRef } from "react";
import {
  FileText,
  Sparkles,
  Download,
  MessageSquare,
  Zap,
  Shield,
  ArrowRight,
  Upload,
  Target,
  ChevronDown,
  Star,
  Users,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { getLoginUrl, isAuthenticated } from "@/lib/api";
import { useRouter } from "next/navigation";

/* =========== Counter Hook =========== */
function useCounter(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const steps = 60;
    const stepTime = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += end / steps;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.round(current));
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return { count, ref };
}

/* =========== FAQ Item =========== */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass rounded-xl overflow-hidden transition-all hover:glow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="font-medium text-sm pr-4">{q}</span>
        <ChevronDown size={16} className={`accordion-icon text-[var(--muted-foreground)] flex-shrink-0 ${open ? "open" : ""}`} />
      </button>
      <div className={`accordion-content ${open ? "open" : ""}`}>
        <p className="px-5 pb-4 text-sm text-[var(--muted-foreground)] leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

/* =========== Main Page =========== */
export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [router]);

  const stat1 = useCounter(10000);
  const stat2 = useCounter(95);
  const stat3 = useCounter(4800);

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col relative overflow-x-hidden">
      {/* Animated background orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-8 py-5 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl btn-primary flex items-center justify-center">
            <Sparkles size={16} className="text-white relative z-10" />
          </div>
          <span className="text-xl font-bold gradient-text">ResumeAI</span>
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
      <header className="relative z-10 flex flex-col items-center justify-center px-6 text-center pt-12 md:pt-20 pb-16">
        <div className="mb-8 animate-[float_6s_ease-in-out_infinite]">
          <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2.5 text-sm font-medium glow-sm">
            <Zap size={14} className="text-[var(--primary)]" />
            <span className="gradient-text font-semibold">AI-Powered Resume Builder</span>
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
          Land Your Dream Job
          <br />
          <span className="gradient-text">with ResumeAI</span>
        </h1>

        <p className="text-base md:text-xl text-[var(--muted-foreground)] max-w-2xl mb-10 leading-relaxed">
          Paste a job description, upload your resume, and let AI generate an ATS-optimized
          resume tailored specifically for the role — in seconds.
        </p>

        <a
          href={getLoginUrl()}
          id="cta-google-login"
          className="group relative inline-flex items-center gap-4 bg-white text-gray-700 px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5 border border-gray-200"
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span>Continue with Google</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </a>
      </header>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-20 w-full">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: FileText, title: "Paste JD", desc: "Drop in any job description and let AI analyze the requirements" },
            { icon: Sparkles, title: "AI Tailors", desc: "Your resume is rewritten by GPT-4o to match the role perfectly" },
            { icon: Download, title: "PDF Ready", desc: "Download an ATS-friendly PDF formatted for applicant tracking" },
            { icon: MessageSquare, title: "Interview Prep", desc: "Get AI-generated interview coaching specific to the role" },
          ].map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="glass rounded-2xl p-6 text-center group hover:glow transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: "backwards" }}
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--accent)] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Icon size={22} className="text-[var(--primary)]" />
              </div>
              <h3 className="font-semibold mb-1.5">{title}</h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24 w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-[var(--muted-foreground)]">Three simple steps to your perfect resume</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              icon: Upload,
              title: "Upload & Paste",
              desc: "Upload your existing resume (PDF/DOCX) and paste the target job description. Add any extra skills or experience you want to highlight.",
            },
            {
              step: "02",
              icon: Target,
              title: "AI Analyzes & Tailors",
              desc: "Our AI analyzes the JD requirements, maps your experience, and rewrites your resume with ATS-optimized keywords and formatting.",
            },
            {
              step: "03",
              icon: Download,
              title: "Download & Apply",
              desc: "Get your tailored resume as a clean PDF, review the ATS score, and prepare for interviews with AI-generated coaching.",
            },
          ].map(({ step, icon: Icon, title, desc }, i) => (
            <div key={step} className="relative">
              {i < 2 && (
                <div className="hidden md:block absolute top-12 right-0 w-full h-px bg-gradient-to-r from-[var(--primary)]/30 to-transparent translate-x-1/2 z-0" />
              )}
              <div className="relative glass rounded-2xl p-6 text-center hover:glow-sm transition-all group animate-fade-in-up" style={{ animationDelay: `${i * 150}ms`, animationFillMode: "backwards" }}>
                <div className="text-5xl font-black gradient-text opacity-20 absolute top-3 right-4">{step}</div>
                <div className="w-14 h-14 rounded-2xl btn-primary flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                  <Icon size={24} className="text-white relative z-10" />
                </div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24 w-full">
        <div className="glass-strong rounded-3xl p-8 md:p-12 glow-sm">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div ref={stat1.ref}>
              <div className="text-3xl md:text-4xl font-bold gradient-text">{stat1.count.toLocaleString()}+</div>
              <p className="text-sm text-[var(--muted-foreground)] mt-1 flex items-center justify-center gap-1.5">
                <Users size={14} /> Resumes Generated
              </p>
            </div>
            <div ref={stat2.ref}>
              <div className="text-3xl md:text-4xl font-bold gradient-text">{stat2.count}%</div>
              <p className="text-sm text-[var(--muted-foreground)] mt-1 flex items-center justify-center gap-1.5">
                <TrendingUp size={14} /> ATS Pass Rate
              </p>
            </div>
            <div ref={stat3.ref}>
              <div className="text-3xl md:text-4xl font-bold gradient-text">{stat3.count.toLocaleString()}+</div>
              <p className="text-sm text-[var(--muted-foreground)] mt-1 flex items-center justify-center gap-1.5">
                <Star size={14} /> Happy Users
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24 w-full">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Loved by <span className="gradient-text">Job Seekers</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { name: "Sarah K.", role: "Software Engineer", quote: "Got 3 interview calls within a week of using ResumeAI. The ATS optimization actually works!" },
            { name: "Michael R.", role: "Product Manager", quote: "The interview prep feature is a game-changer. It predicted 6 out of 8 questions I was asked." },
            { name: "Priya S.", role: "Data Scientist", quote: "I used to spend hours tailoring resumes. Now it takes 30 seconds. The quality is impressive." },
          ].map(({ name, role, quote }) => (
            <div key={name} className="glass rounded-2xl p-6 hover:glow-sm transition-all">
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className="text-[var(--warning)] fill-[var(--warning)]" />
                ))}
              </div>
              <p className="text-sm text-[var(--foreground)] leading-relaxed mb-4">&ldquo;{quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--accent)] flex items-center justify-center text-sm font-bold text-[var(--primary)]">
                  {name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{name}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-24 w-full">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
        </div>
        <div className="space-y-3">
          <FAQItem q="What file formats are supported?" a="You can upload your existing resume as a PDF or DOCX file (up to 10MB). The generated resume is available as a downloadable PDF, formatted text, or structured JSON." />
          <FAQItem q="How does the ATS optimization work?" a="Our AI analyzes the job description for key requirements, skills, and keywords. It then rewrites your resume to naturally incorporate these elements while maintaining authenticity, resulting in higher ATS pass rates." />
          <FAQItem q="Is my data secure?" a="Absolutely. Your resume data is processed securely and is only accessible to you. We use Google OAuth for authentication and never store your Google password." />
          <FAQItem q="Can I use this for multiple job applications?" a="Yes! Generate as many tailored resumes as you need. Each generation is saved to your history, so you can revisit and download any version anytime." />
          <FAQItem q="What AI model powers the resume generation?" a="ResumeAI uses OpenAI's GPT-4o model, which provides state-of-the-art language understanding for analyzing job descriptions and crafting professional resumes." />
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-20 w-full text-center">
        <div className="glass-strong rounded-3xl p-10 md:p-14 glow">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Land Your <span className="gradient-text">Dream Job</span>?
          </h2>
          <p className="text-[var(--muted-foreground)] mb-8 max-w-xl mx-auto">
            Join thousands of job seekers who&apos;ve transformed their applications with AI-powered resumes.
          </p>
          <a
            href={getLoginUrl()}
            className="inline-flex items-center gap-3 btn-primary px-8 py-4 rounded-2xl text-lg font-semibold hover:glow-lg transition-all"
          >
            <span className="relative z-10">Get Started Free</span>
            <ArrowRight size={18} className="relative z-10" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-sm text-[var(--muted-foreground)] border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md btn-primary flex items-center justify-center">
              <Sparkles size={10} className="text-white relative z-10" />
            </div>
            <span className="font-semibold text-[var(--foreground)]">ResumeAI</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5"><Shield size={12} /> Your data stays private</span>
            <span>·</span>
            <span className="flex items-center gap-1.5"><CheckCircle size={12} /> Powered by GPT-4o</span>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} ResumeAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
