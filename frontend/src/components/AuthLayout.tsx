"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/useAuth";
import { getLoginUrl } from "@/lib/api";
import Navbar from "@/components/Navbar";
import { Loader2 } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = getLoginUrl();
    }
  }, [loading, user]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-12 h-12 rounded-2xl btn-primary flex items-center justify-center pulse-glow">
            <Loader2 size={20} className="animate-spin text-white relative z-10" />
          </div>
          <p className="text-sm text-[var(--muted-foreground)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="h-screen w-screen flex flex-col bg-[var(--background)] relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb orb-1 opacity-15"></div>
      <div className="orb orb-2 opacity-15"></div>

      <Navbar />
      <main className="relative z-10 flex-1 flex flex-col overflow-y-auto">
        <div className="animate-fade-in flex-1 flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
