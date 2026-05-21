"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet, isAuthenticated, clearToken } from "@/lib/api";

interface User {
  id: string;
  email: string;
  name: string;
  picture: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      setLoading(false);
      return;
    }
    apiGet<User>("/api/auth/me")
      .then(setUser)
      .catch(() => {
        clearToken();
      })
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    clearToken();
    setUser(null);
    router.push("/");
  };

  return { user, loading, logout };
}
