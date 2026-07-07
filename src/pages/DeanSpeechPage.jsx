import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function DeanSpeechPage() {
  const { t, locale } = useLanguage();
  return (
    <div className="w-full max-w-container-max px-4 py-16 mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-display-lg text-primary font-bold mb-4">{locale === 'ar' ? 'كلمة العميد' : 'Dean Speech'}</h1>
        <div className="w-24 h-px bg-[#c59e62] mx-auto mt-6"></div>
      </div>

      <div className="max-w-5xl mx-auto bg-surface-container-high border border-outline-variant/30 p-8 shadow-sm flex flex-col md:flex-row gap-12 items-center">
        <div className="w-full md:w-1/3">
          <div className="relative border-4 border-[#c59e62] p-2 bg-surface">
            <img 
              src="https://prsxwxpsuhkigtrntaqn.supabase.co/storage/v1/object/public/gallery/WhatsApp%20Image%202026-07-07%20at%209.19.01%20PM.jpeg" 
              alt="Dean" 
              className=""
            />
          </div>
        </div>
        
        <div className="w-full md:w-2/3 flex flex-col justify-center">
          <span className="material-symbols-outlined text-6xl text-[#c59e62]/40 mb-4 font-serif">format_quote</span>
          <p className="text-lg md:text-xl text-primary leading-relaxed font-serif italic mb-8">
            {locale === 'ar' 
              ? 'أبنائي وبناتي الخريجين، إن هذا اليوم يمثل تتويجاً لسنوات من الجهد والمثابرة. لقد أثبتم قدرتكم على تجاوز الصعاب وتحقيق التميز الأكاديمي. أرجو أن تواصلوا مسيرة العطاء والابتكار في حياتكم المهنية لخدمة وطنكم ومجتمعكم.'
              : 'My dear graduates, this day represents the culmination of years of effort and perseverance. You have proven your ability to overcome challenges and achieve academic excellence. I hope you continue the journey of giving and innovation in your professional lives to serve your country and society.'}
          </p>
          
          <div className="border-t border-outline-variant/30 pt-6 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-primary">{t('dean_name')}</h3>
              <p className="text-secondary">{t('dean_role')}</p>
            </div>
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpUSQ-DyWJQnfEo39zBEh8MCI8XwhwFjxpoW92AcJ3zOe0D-Vm3hhXcHBUICFbY81fR26oLK3qBFnkhfnF5yFWykXtTDSWccRfojbyOGOHOKrxWxfI2KPVscZvQzFS9ZVv_y3MllIQ7v5q_qybRV7oWYClZZWeVZvs9q24xS3YI1oDnablSmfdA91gJACnJTlEAm8v5eDRmjtARg9ycfvk8oi1AUuGLg5oPrFufx5lFT3XaJctAo4_" 
              alt="Signature" 
              className="h-16 opacity-70 grayscale"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
