import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, X } from 'lucide-react';

export function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isWarning = toast.type === 'warning';
  const isError = toast.type === 'error';

  return (
    <div className={`toast ${isError ? 'error' : isWarning ? 'warning' : ''}`}>
      {isWarning ? (
        <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0" />
      ) : isError ? (
        <AlertCircle className="w-5 h-5 text-rose-300 shrink-0" />
      ) : (
        <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
      )}
      <span className="text-xs font-medium leading-relaxed">{toast.message}</span>
      <button
        type="button"
        onClick={onClose}
        className="ml-2 hover:opacity-75 focus:outline-none cursor-pointer"
        aria-label="Tutup notifikasi"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default Toast;
