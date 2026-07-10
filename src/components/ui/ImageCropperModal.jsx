import React, { useState, useRef, useEffect } from 'react';

export default function ImageCropperModal({ imageSrc, onCrop, onClose, locale = 'ar' }) {
  const [imgDims, setImgDims] = useState({ width: 0, height: 0 });
  const [crop, setCrop] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [dragType, setDragType] = useState(null); // 'move', 'tl', 'tr', 'bl', 'br', 't', 'b', 'l', 'r'
  
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const dragStart = useRef({ x: 0, y: 0, cropX: 0, cropY: 0, cropW: 0, cropH: 0 });

  const handleImageLoad = () => {
    const img = imgRef.current;
    if (!img) return;
    const width = img.clientWidth;
    const height = img.clientHeight;
    setImgDims({ width, height });
    
    // Initialize crop box to 80% of image size, centered
    const w = Math.round(width * 0.8);
    const h = Math.round(height * 0.8);
    const x = Math.round((width - w) / 2);
    const y = Math.round((height - h) / 2);
    setCrop({ x, y, w, h });
  };

  // Recalculate if dimensions change or window resizes
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      handleImageLoad();
    }
  }, [imageSrc]);

  const handleStart = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setDragType(type);
    
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    dragStart.current = {
      x: clientX,
      y: clientY,
      cropX: crop.x,
      cropY: crop.y,
      cropW: crop.w,
      cropH: crop.h
    };
  };

  const handleMove = (e) => {
    if (!dragType) return;
    
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    const dx = clientX - dragStart.current.x;
    const dy = clientY - dragStart.current.y;
    
    let { cropX, cropY, cropW, cropH } = dragStart.current;
    const minSize = 15; // Minimum size for the crop box (15px allows very small cropping)

    if (dragType === 'move') {
      let nextX = cropX + dx;
      let nextY = cropY + dy;
      
      // Keep within image boundaries
      if (nextX < 0) nextX = 0;
      if (nextY < 0) nextY = 0;
      if (nextX + cropW > imgDims.width) nextX = imgDims.width - cropW;
      if (nextY + cropH > imgDims.height) nextY = imgDims.height - cropH;
      
      setCrop(prev => ({ ...prev, x: nextX, y: nextY }));
    } else {
      let newX = cropX;
      let newY = cropY;
      let newW = cropW;
      let newH = cropH;

      // Adjust boundaries based on handle
      if (dragType.includes('l')) { // Left side drag
        let possibleW = cropW - dx;
        if (possibleW < minSize) possibleW = minSize;
        const nextX = cropX + (cropW - possibleW);
        if (nextX >= 0) {
          newX = nextX;
          newW = possibleW;
        }
      }
      if (dragType.includes('r')) { // Right side drag
        let possibleW = cropW + dx;
        if (possibleW < minSize) possibleW = minSize;
        if (cropX + possibleW <= imgDims.width) {
          newW = possibleW;
        } else {
          newW = imgDims.width - cropX;
        }
      }
      if (dragType.includes('t')) { // Top side drag
        let possibleH = cropH - dy;
        if (possibleH < minSize) possibleH = minSize;
        const nextY = cropY + (cropH - possibleH);
        if (nextY >= 0) {
          newY = nextY;
          newH = possibleH;
        }
      }
      if (dragType.includes('b')) { // Bottom side drag
        let possibleH = cropH + dy;
        if (possibleH < minSize) possibleH = minSize;
        if (cropY + possibleH <= imgDims.height) {
          newH = possibleH;
        } else {
          newH = imgDims.height - cropY;
        }
      }

      setCrop({ x: newX, y: newY, w: newW, h: newH });
    }
  };

  const handleEnd = () => {
    setDragType(null);
  };

  useEffect(() => {
    const handleGlobalMove = (e) => handleMove(e);
    const handleGlobalEnd = () => handleEnd();

    if (dragType) {
      window.addEventListener('mousemove', handleGlobalMove);
      window.addEventListener('mouseup', handleGlobalEnd);
      window.addEventListener('touchmove', handleGlobalMove, { passive: false });
      window.addEventListener('touchend', handleGlobalEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMove);
      window.removeEventListener('mouseup', handleGlobalEnd);
      window.removeEventListener('touchmove', handleGlobalMove);
      window.removeEventListener('touchend', handleGlobalEnd);
    };
  }, [dragType, crop, imgDims]);

  const handleCrop = () => {
    const img = imgRef.current;
    if (!img || imgDims.width === 0) return;

    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    // Map screen crop coordinates to actual image dimensions
    const scaleX = naturalWidth / imgDims.width;
    const scaleY = naturalHeight / imgDims.height;

    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;
    const cropW = crop.w * scaleX;
    const cropH = crop.h * scaleY;

    const canvas = document.createElement('canvas');
    canvas.width = cropW;
    canvas.height = cropH;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

    canvas.toBlob((blob) => {
      if (blob) {
        const croppedFile = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
        onCrop(croppedFile);
      }
    }, 'image/jpeg', 0.9);
  };

  return (
    <div className="fixed inset-0 bg-black/85 z-[999] flex flex-col items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#F5E6D3] dark:bg-surface-container border border-[#c59e62]/20 p-6 md:p-8 max-w-2xl w-full shadow-2xl flex flex-col gap-6 relative">
        <h3 className="text-lg font-bold text-primary border-b border-[#c59e62]/20 pb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#c59e62]">crop</span>
          {locale === 'ar' ? 'ضبط وتهيئة حدود الصورة' : 'Adjust Crop Boundaries'}
        </h3>

        {/* Cropping Area */}
        <div 
          ref={containerRef}
          className="relative bg-black/40 border border-[#c59e62]/20 overflow-hidden flex items-center justify-center select-none mx-auto w-full"
          style={{ height: '350px' }}
        >
          <div className="relative inline-block max-h-full max-w-full">
            <img 
              ref={imgRef}
              src={imageSrc} 
              alt="To Crop" 
              onLoad={handleImageLoad}
              draggable="false"
              className="max-h-[350px] max-w-full pointer-events-none select-none block mx-auto"
            />
            
            {imgDims.width > 0 && (
              <>
                {/* Dark Overlay outside the Crop Box */}
                <div 
                  className="absolute bg-black/60 pointer-events-none"
                  style={{ left: 0, top: 0, width: '100%', height: `${crop.y}px` }}
                />
                <div 
                  className="absolute bg-black/60 pointer-events-none"
                  style={{ left: 0, top: `${crop.y + crop.h}px`, width: '100%', height: `${imgDims.height - (crop.y + crop.h)}px` }}
                />
                <div 
                  className="absolute bg-black/60 pointer-events-none"
                  style={{ left: 0, top: `${crop.y}px`, width: `${crop.x}px`, height: `${crop.h}px` }}
                />
                <div 
                  className="absolute bg-black/60 pointer-events-none"
                  style={{ left: `${crop.x + crop.w}px`, top: `${crop.y}px`, width: `${imgDims.width - (crop.x + crop.w)}px`, height: `${crop.h}px` }}
                />

                {/* The Draggable Crop Box Overlay */}
                <div 
                  className="absolute border-2 border-[#c59e62] cursor-move box-border shadow-[0_0_0_9999px_rgba(0,0,0,0)]"
                  style={{ left: `${crop.x}px`, top: `${crop.y}px`, width: `${crop.w}px`, height: `${crop.h}px` }}
                  onMouseDown={(e) => handleStart(e, 'move')}
                  onTouchStart={(e) => handleStart(e, 'move')}
                >
                  {/* Grid Lines inside crop area */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                    <div className="border-r border-[#c59e62] border-dashed"></div>
                    <div className="border-r border-[#c59e62] border-dashed"></div>
                    <div></div>
                    <div className="border-b border-[#c59e62] border-dashed col-span-3"></div>
                    <div className="border-b border-[#c59e62] border-dashed col-span-3"></div>
                  </div>

                  {/* Corner Handles - large enough for easy finger touch (22px) */}
                  <div 
                    className="absolute -top-3 -left-3 w-55 h-55 rounded-full border-2 border-primary bg-[#c59e62] cursor-nwse-resize z-10 shadow-md flex items-center justify-center"
                    style={{ width: '22px', height: '22px' }}
                    onMouseDown={(e) => handleStart(e, 'tl')}
                    onTouchStart={(e) => handleStart(e, 'tl')}
                  />
                  <div 
                    className="absolute -top-3 -right-3 w-55 h-55 rounded-full border-2 border-primary bg-[#c59e62] cursor-nesw-resize z-10 shadow-md flex items-center justify-center"
                    style={{ width: '22px', height: '22px' }}
                    onMouseDown={(e) => handleStart(e, 'tr')}
                    onTouchStart={(e) => handleStart(e, 'tr')}
                  />
                  <div 
                    className="absolute -bottom-3 -left-3 w-55 h-55 rounded-full border-2 border-primary bg-[#c59e62] cursor-nesw-resize z-10 shadow-md flex items-center justify-center"
                    style={{ width: '22px', height: '22px' }}
                    onMouseDown={(e) => handleStart(e, 'bl')}
                    onTouchStart={(e) => handleStart(e, 'bl')}
                  />
                  <div 
                    className="absolute -bottom-3 -right-3 w-55 h-55 rounded-full border-2 border-primary bg-[#c59e62] cursor-nwse-resize z-10 shadow-md flex items-center justify-center"
                    style={{ width: '22px', height: '22px' }}
                    onMouseDown={(e) => handleStart(e, 'br')}
                    onTouchStart={(e) => handleStart(e, 'br')}
                  />

                  {/* Side Border Drag Handles - thick touch area (16px) */}
                  <div 
                    className="absolute -top-2 left-4 right-4 h-4 cursor-n-resize"
                    onMouseDown={(e) => handleStart(e, 't')}
                    onTouchStart={(e) => handleStart(e, 't')}
                  />
                  <div 
                    className="absolute -bottom-2 left-4 right-4 h-4 cursor-s-resize"
                    onMouseDown={(e) => handleStart(e, 'b')}
                    onTouchStart={(e) => handleStart(e, 'b')}
                  />
                  <div 
                    className="absolute -left-2 top-4 bottom-4 w-4 cursor-w-resize"
                    onMouseDown={(e) => handleStart(e, 'l')}
                    onTouchStart={(e) => handleStart(e, 'l')}
                  />
                  <div 
                    className="absolute -right-2 top-4 bottom-4 w-4 cursor-e-resize"
                    onMouseDown={(e) => handleStart(e, 'r')}
                    onTouchStart={(e) => handleStart(e, 'r')}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Informative text */}
        <p className="text-xs text-secondary text-center">
          {locale === 'ar' 
            ? '💡 اسحب المربع المضيء لتحريك موضع القص، أو اسحب الدوائر والحدود الجانبية لتعديل الطول والعرض للحدود بدقة.' 
            : '💡 Drag the lit box to move the crop position, or drag the handles/borders to adjust the width and height bounds precisely.'}
        </p>

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
