import React, { useEffect } from 'react';

export default function Lightbox({ isOpen, images, currentIndex, onClose, onPrev, onNext }) {
  // Prevent body scroll when lightbox is open
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

  // Handle keyboard shortcuts (ArrowLeft, ArrowRight, Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') onNext();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onNext, onPrev, onClose]);

  if (!isOpen || !images || images.length === 0) return null;

  const currentImage = images[currentIndex];
  
  // Format Date if present
  const imageDate = currentImage.date || '';

  return (
    <div className="fixed inset-0 bg-primary/95 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-4 md:p-8 animate-fade-in text-white">
      {/* Top controls */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 flex gap-4 z-50">
        {/* Download Trigger */}
        <a
          href={currentImage.src}
          download={`memory_${currentIndex + 1}.jpg`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-on-primary hover:text-[#c59e62] transition-colors p-2.5 flex items-center justify-center bg-black/40 hover:bg-black/60 rounded-full"
          title="Download Image"
        >
          <span className="material-symbols-outlined text-2xl font-bold">download</span>
        </a>
        <button
          onClick={onClose}
          className="text-on-primary hover:text-[#c59e62] transition-colors p-2.5 flex items-center justify-center bg-black/40 hover:bg-black/60 rounded-full"
          aria-label="Close Lightbox"
        >
          <span className="material-symbols-outlined text-2xl font-bold">close</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="relative flex flex-col items-center justify-center max-w-5xl w-full h-[70vh]">
        {/* Navigation - Left */}
        <button
          onClick={onPrev}
          className="absolute left-2 md:left-4 z-50 text-on-primary hover:text-[#c59e62] transition-colors p-3 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center border-0 cursor-pointer"
          aria-label="Previous Image"
        >
          <span className="material-symbols-outlined text-3xl font-bold">
            {document.documentElement.dir === 'rtl' ? 'arrow_forward' : 'arrow_back'}
          </span>
        </button>

        {/* The Image */}
        <img
          src={currentImage.src}
          alt={currentImage.caption || 'Graduation Memory'}
          className="max-w-full max-h-full object-contain select-none animate-scale-up border border-[#c59e62]/20"
        />

        {/* Navigation - Right */}
        <button
          onClick={onNext}
          className="absolute right-2 md:right-4 z-50 text-on-primary hover:text-[#c59e62] transition-colors p-3 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center border-0 cursor-pointer"
          aria-label="Next Image"
        >
          <span className="material-symbols-outlined text-3xl font-bold">
            {document.documentElement.dir === 'rtl' ? 'arrow_back' : 'arrow_forward'}
          </span>
        </button>
      </div>

      {/* Caption & Date & Counter */}
      <div className="text-center mt-6 max-w-2xl px-4 select-none">
        <h3 className="font-headline-sm text-headline-sm text-[#c59e62] mb-1 font-bold">
          {currentImage.caption || 'Graduation Memory'}
        </h3>
        
        {/* Date Display */}
        {imageDate && (
          <p className="font-body-md text-xs text-white/50 mb-2 font-semibold">
            {document.documentElement.dir === 'rtl' ? 'تاريخ الالتقاط: ' : 'Capture Date: '}
            {imageDate}
          </p>
        )}
        
        <p className="font-body-md text-xs text-white/40 font-bold">
          {currentIndex + 1} / {images.length}
        </p>
      </div>
    </div>
  );
}
