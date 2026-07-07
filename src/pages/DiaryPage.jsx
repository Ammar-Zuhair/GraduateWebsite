import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

export default function DiaryPage() {
  const { locale } = useLanguage();
  const { diary, addDiary } = useData();

  // Form states
  const [authorName, setAuthorName] = useState('');
  const [memoryMessage, setMemoryMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccess(false);

    if (!memoryMessage.trim()) {
      setErrorMsg(locale === 'ar' ? 'يرجى كتابة ذكرى قبل الإرسال.' : 'Please write a memory before submitting.');
      return;
    }

    addDiary({
      author: authorName || (locale === 'ar' ? 'عضو دفعة مجهول' : 'Anonymous Cohort Member'),
      message: memoryMessage
    });

    setAuthorName('');
    setMemoryMessage('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-24">
      {/* Title */}
      <header className="text-center mb-16">
        <h1 className="font-display-lg text-display-lg text-primary mb-6 font-bold leading-tight">
          {locale === 'ar' ? 'دفتر الذكريات الجامعية' : 'University Memory Notebook'}
        </h1>
        <p className="font-body-lg text-body-lg text-secondary max-w-2xl mx-auto leading-relaxed">
          {locale === 'ar' 
            ? 'سجل لحظة جميلة، فكرة، أو موقفاً طريفاً عشته مع زملائك في الدفعة ليبقى خالداً في أرشيفنا.' 
            : 'Write a beautiful moment, thought, or funny situation you experienced with your peers to stay in our archive.'}
        </p>
      </header>

      {/* Main Grid: Form Left, Notes Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start max-w-5xl mx-auto">
        {/* Write Note Form */}
        <section className="lg:col-span-1 bg-[#F5E6D3] dark:bg-surface-container p-6 md:p-8 border border-[#c59e62]/20 shadow-sm flex flex-col gap-6 w-full">
          <h3 className="font-headline-sm text-base text-primary font-bold border-b border-primary/10 pb-3">
            {locale === 'ar' ? 'سجل ذكرى جديدة' : 'Add a Memory'}
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {errorMsg && (
              <div className="p-3 bg-error-container border border-error/20 text-error font-bold text-xs">
                {errorMsg}
              </div>
            )}
            {success && (
              <div className="p-3 bg-[#efe0cd] border border-[#c59e62] text-primary font-bold text-xs">
                {locale === 'ar' ? 'تم تسجيل ذكرياتك بنجاح!' : 'Memory saved successfully!'}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="font-label-md text-xs text-on-surface-variant font-bold block mb-1">
                {locale === 'ar' ? 'الاسم (اختياري)' : 'Your Name (Optional)'}
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="bg-transparent border-0 border-b-2 border-primary-container focus:ring-0 focus:border-on-tertiary-container py-2 font-body-md text-sm text-primary placeholder-outline/50"
                placeholder={locale === 'ar' ? 'اكتب اسمك أو اتركه مجهولاً' : 'Write name or leave empty'}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label-md text-xs text-on-surface-variant font-bold block mb-1">
                {locale === 'ar' ? 'الذكرى الجامعية' : 'The Memory'}
              </label>
              <textarea
                value={memoryMessage}
                onChange={(e) => setMemoryMessage(e.target.value)}
                rows="4"
                className="bg-transparent border-0 border-b-2 border-primary-container focus:ring-0 focus:border-on-tertiary-container py-2 font-body-md text-sm text-primary placeholder-outline/50 resize-none"
                placeholder={locale === 'ar' ? 'ما هي اللحظة الجميلة التي تود كتابتها؟' : 'What is the moment you want to record?'}
              />
            </div>

            <button
              type="submit"
              className="bg-primary text-white font-label-md text-xs py-3.5 hover:bg-primary-container transition-all font-bold cursor-pointer select-none border-0"
            >
              {locale === 'ar' ? 'تسجيل في الدفتر' : 'Write in Notebook'}
            </button>
          </form>
        </section>

        {/* Notebook entries (Post-it style) */}
        <section className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          {diary.map(entry => (
            <div
              key={entry.id}
              className="bg-[#efe0cd] dark:bg-surface-container border-l-4 border-[#c59e62] p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative"
            >
              {/* Pushpin symbol for premium diary look */}
              <span className="absolute top-3 right-3 text-[#c59e62] material-symbols-outlined text-lg select-none">
                push_pin
              </span>
              
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed italic mb-6">
                "{entry.message[locale] || entry.message.ar}"
              </p>
              
              <div className="border-t border-primary/10 pt-4 flex justify-between items-center text-xs text-secondary font-bold select-none">
                <span>{entry.author[locale] || entry.author.ar}</span>
                <span>{entry.date}</span>
              </div>
            </div>
          ))}

          {diary.length === 0 && (
            <div className="col-span-2 text-center py-10 bg-surface-container border border-outline-variant/10 text-secondary text-sm font-semibold">
              {locale === 'ar' ? 'لا توجد مذكرات مكتوبة بعد. كن أول من يسجل ذكرى!' : 'No notebook memories written yet. Be the first!'}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
