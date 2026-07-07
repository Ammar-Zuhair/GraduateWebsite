import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function GalleryLightbox({ image, onClose, onNext, onPrev }) {
  const { locale } = useLanguage();

  if (!image) return null;

  const downloadImage = (e) => {
    e.stopPropagation();
    fetch(image.url)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `graduation_memory_${image.id}.jpg`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      });
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
    >
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-primary-fixed transition-colors"
      >
        <span className="material-symbols-outlined text-4xl">close</span>
      </button>

      {/* Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white flex justify-between items-end" onClick={(e) => e.stopPropagation()}>
        <div>
          <h3 className="text-xl font-bold mb-1">{image[`title_${locale}`]}</h3>
          <p className="text-sm opacity-80">{new Date(image.created_at).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}</p>
        </div>
        
        {/* Download Button */}
        <button 
          onClick={downloadImage}
          className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded hover:bg-opacity-90 transition-all"
        >
          <span className="material-symbols-outlined">download</span>
          {locale === 'ar' ? 'تحميل' : 'Download'}
        </button>
      </div>

      {/* Navigation Buttons */}
      {onPrev && (
        <button 
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-6 text-white hover:text-primary-fixed transition-colors"
        >
          <span className="material-symbols-outlined text-5xl">chevron_left</span>
        </button>
      )}

      {onNext && (
        <button 
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-6 text-white hover:text-primary-fixed transition-colors"
        >
          <span className="material-symbols-outlined text-5xl">chevron_right</span>
        </button>
      )}

      {/* Image */}
      <div 
        className="relative max-w-5xl w-full h-[80vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={image.url} 
          alt={image[`title_${locale}`]} 
          className="max-w-full max-h-full object-contain rounded drop-shadow-2xl"
        />
      </div>
    </div>
  );
}
