import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

export default function NewsPage() {
  const { locale } = useLanguage();
  const { news } = useData();

  return (
    <div className="w-full max-w-container-max px-4 py-16 mx-auto min-h-[70vh]">
      <div className="text-center mb-16">
        <h1 className="text-display-lg text-primary font-bold mb-4">{locale === 'ar' ? 'الأخبار والإعلانات' : 'News & Announcements'}</h1>
        <div className="w-24 h-px bg-[#c59e62] mx-auto mt-6"></div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {news.length === 0 ? (
          <p className="text-center text-on-surface-variant text-lg">
            {locale === 'ar' ? 'لا توجد أخبار حالياً.' : 'No news available at the moment.'}
          </p>
        ) : (
          news.map((item) => (
            <div key={item.id} className="bg-surface-container-high border-l-4 border-[#c59e62] rtl:border-l-0 rtl:border-r-4 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-primary">{item[`title_${locale}`]}</h2>
                {item.event_date && (
                  <span className="text-xs bg-[#c59e62]/20 text-primary px-3 py-1 font-bold whitespace-nowrap">
                    {new Date(item.event_date).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                  </span>
                )}
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                {item[`content_${locale}`]}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
