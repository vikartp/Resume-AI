"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setToken } from "@/lib/api";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setToken(token);
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] relative overflow-hidden">
      <div className="orb orb-1 opacity-30"></div>
      <div className="orb orb-2 opacity-30"></div>
      <div className="text-center relative z-10 glass rounded-3xl p-12 glow">
        <div className="w-16 h-16 rounded-2xl btn-primary flex items-center justify-center mx-auto mb-6 pulse-glow">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent relative z-10"></div>
        </div>
        <p className="text-[var(--muted-foreground)] text-lg">Signing you in...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <CallbackContent />
    </Suspense>
  );
}
