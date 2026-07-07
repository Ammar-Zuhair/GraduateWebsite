import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function MapPage() {
  const { locale } = useLanguage();
  return (
    <div className="w-full max-w-container-max px-4 py-16 mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-display-lg text-primary font-bold mb-4">{locale === 'ar' ? 'موقع الحفل' : 'Venue Map'}</h1>
        <div className="w-24 h-px bg-[#c59e62] mx-auto mt-6"></div>
      </div>

      <div className="max-w-5xl mx-auto bg-surface-container-high border border-outline-variant/30 p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center">
        <div className="w-full md:w-1/2">
          <h2 className="text-2xl font-bold text-primary mb-6">
            {locale === 'ar' ? 'تفاصيل الموقع' : 'Location Details'}
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#c59e62]">location_on</span>
              <div>
                <strong className="block text-primary">{locale === 'ar' ? 'المكان:' : 'Venue:'}</strong>
                <a 
                  href="https://maps.app.goo.gl/Ju9aZphgT1va5Xc26" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-on-surface-variant hover:text-[#c59e62] transition-colors underline font-bold"
                >
                  {locale === 'ar' ? 'القاعة العالمية الكبرى (شارع الدائري)' : 'Grand Global Hall (Al-Dairi Street)'}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#c59e62]">schedule</span>
              <div>
                <strong className="block text-primary">{locale === 'ar' ? 'الوقت:' : 'Time:'}</strong>
                <span className="text-on-surface-variant">{locale === 'ar' ? 'الساعة 8:00 صباحاً' : '8:00 AM'}</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#c59e62]">calendar_month</span>
              <div>
                <strong className="block text-primary">{locale === 'ar' ? 'التاريخ:' : 'Date:'}</strong>
                <span className="text-on-surface-variant">{locale === 'ar' ? '20 يوليو (7/20)' : 'July 20 (7/20)'}</span>
              </div>
            </li>
          </ul>
        </div>
        
        <a 
          href="https://maps.app.goo.gl/Ju9aZphgT1va5Xc26" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-full md:w-1/2 aspect-video bg-[#361f1a]/5 hover:bg-[#361f1a]/10 border border-[#c59e62]/20 flex flex-col items-center justify-center text-center p-6 transition-all duration-300 group cursor-pointer text-decoration-none"
        >
          <span className="material-symbols-outlined text-5xl text-[#c59e62] mb-3 group-hover:scale-110 transition-transform duration-300">map</span>
          <p className="text-primary font-bold text-sm mb-1">{locale === 'ar' ? 'اضغط لفتح الموقع في خرائط Google' : 'Click to open in Google Maps'}</p>
          <span className="text-xs text-secondary underline">{locale === 'ar' ? 'عرض الاتجاهات والموقع الجغرافي' : 'Get directions & coordinates'}</span>
        </a>
      </div>
    </div>
  );
}
