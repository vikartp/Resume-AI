"use client";

import { useEffect, useState, createContext, useContext, useCallback } from "react";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  exiting?: boolean;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const colorMap = {
  success: { bg: "rgba(16, 185, 129, 0.12)", border: "rgba(16, 185, 129, 0.3)", text: "var(--success)", bar: "var(--success)" },
  error: { bg: "rgba(239, 68, 68, 0.12)", border: "rgba(239, 68, 68, 0.3)", text: "var(--destructive)", bar: "var(--destructive)" },
  info: { bg: "rgba(99, 102, 241, 0.12)", border: "rgba(99, 102, 241, 0.3)", text: "var(--primary)", bar: "var(--primary)" },
  warning: { bg: "rgba(245, 158, 11, 0.12)", border: "rgba(245, 158, 11, 0.3)", text: "var(--warning)", bar: "var(--warning)" },
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const Icon = iconMap[toast.type];
  const colors = colorMap[toast.type];
  const duration = toast.duration || 4000;

  return (
    <div
      className={`relative glass-strong rounded-xl px-4 py-3 flex items-start gap-3 min-w-[320px] max-w-[420px] ${toast.exiting ? "animate-slide-out" : "animate-slide-in"}`}
      style={{ borderLeft: `3px solid ${colors.bar}` }}
      role="alert"
    >
      <Icon size={18} style={{ color: colors.text, marginTop: 2, flexShrink: 0 }} />
      <p className="text-sm flex-1" style={{ color: "var(--foreground)" }}>{toast.message}</p>
      <button onClick={() => onDismiss(toast.id)} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors flex-shrink-0 mt-0.5">
        <X size={14} />
      </button>
      <div
        className="toast-progress"
        style={{ background: colors.bar, "--toast-duration": `${duration}ms` } as React.CSSProperties}
      />
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 250);
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "info", duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    setTimeout(() => dismissToast(id), duration);
  }, [dismissToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
