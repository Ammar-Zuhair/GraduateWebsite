import React, { useState, useRef, useEffect } from 'react';

export default function ImageCropperModal({ imageSrc, aspectRatio = 1, circular = false, onCrop, onClose, locale = 'ar' }) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  // Reset states when image changes
  useEffect(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, [imageSrc]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile/phone
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setOffset({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    });
  };

  const handleCrop = () => {
    const img = imgRef.current;
    const container = containerRef.current;
    if (!img || !container) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Viewport dimensions (the crop mask dimensions)
    const viewWidth = container.clientWidth;
    const viewHeight = container.clientHeight;

    // Set canvas dimensions based on target aspect ratio
    canvas.width = aspectRatio === 1 ? 400 : 800;
    canvas.height = canvas.width / aspectRatio;

    // Calculate how the image is drawn
    // Get image's current rendered dimensions and positions
    const imgRect = img.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Map container scale to canvas scale
    const scaleX = canvas.width / viewWidth;
    const scaleY = canvas.height / viewHeight;

    // Position of image relative to container crop viewport
    const dx = (imgRect.left - containerRect.left) * scaleX;
    const dy = (imgRect.top - containerRect.top) * scaleY;
    const dw = imgRect.width * scaleX;
    const dh = imgRect.height * scaleY;

    // Clear and draw image onto canvas
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, dx, dy, dw, dh);

    canvas.toBlob((blob) => {
      if (blob) {
        const croppedFile = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
        onCrop(croppedFile);
      }
    }, 'image/jpeg', 0.9);
  };

  return (
    <div className="fixed inset-0 bg-black/85 z-[999] flex flex-col items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#F5E6D3] dark:bg-surface-container border border-[#c59e62]/20 p-6 md:p-8 max-w-md w-full shadow-2xl flex flex-col gap-6 relative">
        <h3 className="text-lg font-bold text-primary border-b border-[#c59e62]/20 pb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#c59e62]">crop</span>
          {locale === 'ar' ? 'ضبط وتهيئة قياسات الصورة' : 'Adjust & Crop Image'}
        </h3>

        {/* Viewport container */}
        <div 
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          className="relative overflow-hidden w-full bg-black/40 border border-[#c59e62]/30 cursor-move flex items-center justify-center mx-auto"
          style={{ 
            height: '240px',
            maxWidth: '100%',
            borderRadius: circular ? '9999px' : '4px',
            aspectRatio: aspectRatio
          }}
        >
          <img 
            ref={imgRef}
            src={imageSrc} 
            alt="To Crop" 
            draggable="false"
            className="max-w-none origin-center select-none"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
              height: aspectRatio === 1 ? '100%' : 'auto',
              width: aspectRatio !== 1 ? '100%' : 'auto',
              transition: isDragging ? 'none' : 'transform 0.1s ease-out'
            }}
          />
          {/* Inner masking guidelines */}
          <div className="absolute inset-0 pointer-events-none border-2 border-[#c59e62]/50 rounded-inherit"></div>
        </div>

        {/* Zoom Slider */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs font-semibold text-secondary">
            <span>{locale === 'ar' ? 'تكبير / تصغير' : 'Zoom'}</span>
            <span>{Math.round(zoom * 100)}%</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="3" 
            step="0.05" 
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full accent-[#c59e62] cursor-pointer"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 border-t border-[#c59e62]/20 pt-4">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 border border-outline-variant/30 text-secondary text-xs font-bold hover:bg-black/5 bg-transparent cursor-pointer"
          >
            {locale === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>
          <button 
            type="button" 
            onClick={handleCrop}
            className="px-6 py-2 bg-[#c59e62] text-primary hover:bg-[#ffdeae] text-xs font-bold border-0 cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">check</span>
            {locale === 'ar' ? 'تطبيق وقص' : 'Apply Crop'}
          </button>
        </div>
      </div>
    </div>
  );
}
