import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "ResumeAI — AI-Powered Resume Builder | Land Your Dream Job",
  description:
    "Generate ATS-optimized resumes tailored to any job description in seconds. Upload your resume, paste the JD, and let AI craft the perfect application.",
  keywords: ["resume builder", "ATS resume", "AI resume", "job application", "career tools"],
  openGraph: {
    title: "ResumeAI — AI-Powered Resume Builder",
    description: "Generate ATS-optimized resumes tailored to any job description in seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className="h-full">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
