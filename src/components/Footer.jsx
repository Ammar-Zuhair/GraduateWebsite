import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer({ setActivePage }) {
  const { t, locale } = useLanguage();

  return (
    <footer className="bg-primary text-on-primary font-body-md text-body-md border-t border-outline-variant/20 w-full shadow-inner mt-auto">
      <div className="w-full max-w-container-max mx-auto px-4 md:px-8 py-16 flex flex-col items-center text-center">
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-10 mb-12 border-b border-white/10 pb-10">
        
        {/* Slogans & Logo */}
        <div className="flex flex-col items-center md:items-start text-center md:text-right rtl:md:text-right ltr:md:text-left gap-3">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#c59e62] text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              school
            </span>
            <span className="font-headline-sm text-headline-sm text-white font-extrabold select-none">
              {t('logo')}
            </span>
          </div>
          <p className="font-body-md text-sm text-on-primary/60 italic max-w-sm mt-2">
            {locale === 'ar' 
              ? 'قد تنتهي سنوات الدراسة... لكن الذكريات ستبقى إلى الأبد.' 
              : 'School years may end... but memories will stay forever.'}
          </p>
        </div>

        {/* Navigation Quick Links */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <span className="font-label-md text-[#c59e62] uppercase tracking-widest font-bold text-xs select-none">
            {locale === 'ar' ? 'روابط سريعة' : 'Quick Links'}
          </span>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a 
              className="text-on-primary/80 hover:text-[#ffdeae] transition-colors" 
              href="#" 
              onClick={(e) => { e.preventDefault(); setActivePage('students'); }}
            >
              
            </a>
            <a 
              className="text-on-primary/80 hover:text-[#ffdeae] transition-colors" 
              href="#" 
              onClick={(e) => { e.preventDefault(); setActivePage('students'); }}
            >
              
            </a>
            <a 
              className="text-on-primary/80 hover:text-[#ffdeae] transition-colors" 
              href="#" 
              onClick={(e) => { e.preventDefault(); setActivePage('congratulations'); }}
            >
              
            </a>
            <a 
              className="text-on-primary/80 hover:text-[#ffdeae] transition-colors" 
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-on-primary/50">
        <p>{t('copyright')}</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition-colors">WhatsApp</a>
          <a href="#" className="hover:text-white transition-colors">Telegram</a>
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
        </div>
      </div>
      </div>
    </footer>
  );
}
