import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils.js';

export function Toast({ toast, onClose, duration = 4000 }) {
  useEffect(() => {
    if (!toast || !onClose) return;

    const timeoutDuration =
      typeof toast === 'object' && typeof toast?.duration === 'number'
        ? toast.duration
        : duration;

    if (timeoutDuration <= 0) return;

    const timer = setTimeout(() => {
      onClose();
    }, timeoutDuration);

    return () => clearTimeout(timer);
  }, [toast, onClose, duration]);

  if (!toast) return null;

  const message = typeof toast === 'string' ? toast : toast?.message;
  const type = typeof toast === 'object' ? toast?.type : 'success';
  const isWarning = type === 'warning';
  const isError = type === 'error' || type === 'danger';
  const isInfo = type === 'info';

  const config = isError
    ? {
        containerClass: 'bg-rose-600 text-white border-rose-500/40 shadow-rose-950/25',
        icon: <AlertCircle className="w-5 h-5 text-rose-100 shrink-0" />,
      }
    : isWarning
    ? {
        containerClass: 'bg-amber-600 text-white border-amber-500/40 shadow-amber-950/25',
        icon: <AlertTriangle className="w-5 h-5 text-amber-100 shrink-0" />,
      }
    : isInfo
    ? {
        containerClass: 'bg-blue-600 text-white border-blue-500/40 shadow-blue-950/25',
        icon: <Info className="w-5 h-5 text-blue-100 shrink-0" />,
      }
    : {
        containerClass: 'bg-emerald-600 text-white border-emerald-500/40 shadow-emerald-950/25',
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-100 shrink-0" />,
      };

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'toast fixed z-[100] flex items-center gap-3 px-4 py-3 sm:py-3.5 rounded-xl shadow-xl border text-xs font-medium leading-relaxed max-w-md break-words',
        'top-5 right-5 sm:top-6 sm:right-6',
        config.containerClass,
        'animate-in fade-in slide-in-from-top-4 duration-200'
      )}
    >
      <div className="shrink-0 mt-0.5 sm:mt-0">
        {config.icon}
      </div>

      <div className="flex-1 text-xs font-medium leading-relaxed break-words min-w-0">
        {message}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors shrink-0 cursor-pointer -mr-1 -mt-0.5 sm:mt-0"
        aria-label="Tutup notifikasi"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default Toast;
