"use client";

import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "default";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={onCancel} />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="modal-content glass-strong rounded-2xl p-6 max-w-md w-full glow-sm">
          <div className="flex items-start gap-4 mb-5">
            {variant === "danger" && (
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(239, 68, 68, 0.1)" }}>
                <AlertTriangle size={20} className="text-[var(--destructive)]" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg mb-1">{title}</h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{message}</p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-xl text-sm font-medium glass hover:bg-[var(--accent)] transition-all"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                variant === "danger"
                  ? "bg-[var(--destructive)] text-white hover:opacity-90"
                  : "btn-primary"
              }`}
            >
              {variant === "danger" ? confirmText : <span className="relative z-10">{confirmText}</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
