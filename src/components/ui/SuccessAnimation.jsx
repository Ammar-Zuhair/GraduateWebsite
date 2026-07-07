import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function SuccessAnimation({ onComplete }) {
  const { locale } = useLanguage();
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(true);
    }, 500); // Show text after a small delay for dramatic effect

    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 4000); // Complete after 4 seconds

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center h-64 animate-in fade-in zoom-in duration-500">
      <div className="relative">
        <span className="text-8xl block animate-bounce" style={{ animationDuration: '2s' }}>🎉</span>
        <span className="absolute -top-4 -right-4 text-4xl animate-ping text-primary">✨</span>
        <span className="absolute -bottom-2 -left-4 text-4xl animate-pulse text-tertiary-fixed-dim">✨</span>
      </div>
      
      <div className={`mt-8 text-center transition-opacity duration-1000 ${showText ? 'opacity-100' : 'opacity-0'}`}>
        <h3 className="text-2xl font-bold text-primary mb-2">
          {locale === 'ar' ? 'تم إرسال التهنئة بنجاح!' : 'Wish Sent Successfully!'}
        </h3>
        <p className="text-on-surface-variant text-lg">
          {locale === 'ar' ? 'شكراً لمشاركتك فرحة الخريجين ❤️' : 'Thank you for sharing the joy of graduates ❤️'}
        </p>
      </div>
    </div>
  );
}
