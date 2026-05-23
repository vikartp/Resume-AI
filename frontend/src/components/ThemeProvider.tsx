"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ToastProvider } from "@/components/Toast";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
      <ToastProvider>{children}</ToastProvider>
    </NextThemesProvider>
  );
}
