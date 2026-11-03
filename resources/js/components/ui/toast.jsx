import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className={`toast ${toast.type === 'error' ? 'error' : ''}`}>
      {toast.type === 'success' ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-rose-300 shrink-0" />
      )}
      <span className="text-xs font-medium leading-relaxed">{toast.message}</span>
      <button
        type="button"
        onClick={onClose}
        className="ml-2 hover:opacity-75 focus:outline-none"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default Toast;

