import * as React from 'react';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils.js';

const sizeMap = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  '2xl': 'max-w-5xl',
  full: 'max-w-[calc(100vw-2rem)]',
};

function Modal({
  isOpen = false,
  onClose,
  children,
  size = 'lg',
  className = '',
  closeOnBackdrop = true,
  closeOnEsc = true,
}) {
  // ESC key listener
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEsc, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClass = sizeMap[size] || sizeMap.lg;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xs overflow-y-auto"
      onClick={closeOnBackdrop ? onClose : undefined}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          'relative w-full rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-200/80 max-h-[calc(100dvh-2.5rem)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150',
          maxWidthClass,
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function ModalHeader({
  icon,
  title,
  description,
  onClose,
  children,
  className = '',
}) {
  return (
    <div
      className={cn(
        'px-6 py-5 border-b border-slate-100 bg-white flex items-start justify-between gap-4 shrink-0',
        className
      )}
    >
      <div className="flex items-start gap-3 min-w-0">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-[#f7f2e8] border border-[#c4a266]/30 flex items-center justify-center text-[#c4a266] shrink-0 mt-0.5">
            {React.isValidElement(icon) ? (
              icon
            ) : typeof icon === 'function' ? (
              React.createElement(icon, { className: 'w-5 h-5' })
            ) : (
              icon
            )}
          </div>
        )}
        <div className="min-w-0 flex-1">
          {title && (
            <h2 className="text-base font-bold text-navy font-display truncate">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0 -mr-1 -mt-1"
          aria-label="Tutup dialog"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

function ModalBody({ className = '', children, ...props }) {
  return (
    <div
      className={cn('p-6 overflow-y-auto no-scrollbar flex-1', className)}
      {...props}
    >
      {children}
    </div>
  );
}

function ModalFooter({ className = '', children, ...props }) {
  return (
    <div
      className={cn(
        'px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-end gap-2.5 shrink-0',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Modal, ModalHeader, ModalBody, ModalFooter };

