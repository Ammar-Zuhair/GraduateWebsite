import React, { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Backdrop Click Handler */}
      <div className="absolute inset-0 cursor-default" onClick={onClose}></div>

      {/* Modal Dialog Box */}
      <div className="relative bg-[#F5E6D3] border border-[#c59e62] max-w-2xl w-full p-8 md:p-12 shadow-[0px_10px_30px_rgba(78,52,46,0.15)] animate-scale-up z-10 flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-primary/10 pb-4">
          <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
            {title}
          </h3>
          {/* Close button */}
          <button
            onClick={onClose}
            className="text-secondary hover:text-primary transition-colors p-2 flex items-center justify-center border border-outline-variant/30 hover:bg-[#361f1a]/5 rounded-none"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-2xl font-bold">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[70vh] pr-2 scrollbar-thin">
          {children}
        </div>
      </div>
    </div>
  );
}
