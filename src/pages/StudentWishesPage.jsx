import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export default function StudentWishesPage({ studentId, onBack }) {
  const { locale } = useLanguage();
  const { students, wishes, deleteWish } = useData();
  const { user } = useAuth();

  const student = students.find((g) => g.id === studentId);
  
  if (!student) {
    return <div className="py-24 text-center">Loading...</div>;
  }

  const isOwner = user?.id === student.user_id;

  // Privacy Protection: only allow the graduate owner to see this wishes page
  if (!isOwner) {
    return (
      <div className="w-full max-w-container-max px-4 py-24 text-center flex flex-col items-center justify-center gap-4">
        <span className="material-symbols-outlined text-6xl text-[#c59e62]">lock</span>
        <h2 className="text-2xl font-bold text-primary">
          {locale === 'ar' ? 'خصوصية التهاني محمية' : 'Wishes Privacy Protected'}
        </h2>
        <p className="text-secondary max-w-md mx-auto text-sm leading-relaxed">
          {locale === 'ar' 
            ? 'عذراً، حائط التهاني في هذا الحساب مخصص فقط لرؤية الخريج نفسه حفاظاً على الخصوصية ولا يمكن للعامة تصفحه.' 
            : 'Sorry, wishes wall in this account is private to the graduate and cannot be viewed by the public.'}
        </p>
      </div>
    );
  }

  // Calculate wishes for this student (approved or status undefined/all since they bypass admin approval now)
  const studentWishes = wishes.filter(w => w.student_id === student.id);
  const wishesCount = studentWishes.length;

  return (
    <div className="w-full max-w-container-max px-4 md:px-8 py-12 mx-auto bg-background">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 border-b border-[#c59e62]/20 pb-6 gap-4">
        <div>
          <button
            onClick={onBack}
            className="text-primary hover:text-[#c59e62] flex items-center gap-2 font-bold transition-colors border-0 bg-transparent cursor-pointer mb-2"
          >
            <span className="material-symbols-outlined font-bold">
              {locale === 'ar' ? 'arrow_forward' : 'arrow_back'}
            </span>
            {locale === 'ar' ? 'الرجوع للرئيسية' : 'Back to Home'}
          </button>
          <h1 className="text-3xl font-bold text-primary">
            {locale === 'ar' ? 'حائط تهانيّ الخاصة' : 'My Private Wishes Wall'}
          </h1>
          <p className="text-secondary text-sm mt-1">
            {locale === 'ar' 
              ? 'الرسائل والتهاني التي أرسلها لك الأهل والأصدقاء بمناسبة التخرج.' 
              : 'Messages and wishes sent to you by family and friends.'}
          </p>
        </div>
        
        <div className="bg-[#FAF8F5] dark:bg-surface-container border border-[#c59e62]/20 px-6 py-4 flex flex-col items-center">
          <span className="text-3xl font-black text-[#c59e62]">{wishesCount}</span>
          <span className="text-xs text-primary/70 font-bold mt-1 uppercase tracking-wider">
            {locale === 'ar' ? 'تهنئة مستلمة' : 'Received Wishes'}
          </span>
        </div>
      </div>

      {/* Wishes Grid */}
      {studentWishes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch mb-16">
          {studentWishes.map((wish) => (
            <div
              key={wish.id}
              className="bg-[#F5E6D3] dark:bg-surface-container border border-[#c59e62]/20 p-8 flex flex-col justify-between h-full hover:-translate-y-1 transition-transform duration-300 shadow-sm"
            >
              <div className="flex justify-between items-start gap-4 mb-4 select-none">
                <span className="material-symbols-outlined text-[#c59e62] text-3xl opacity-60" style={{ fontVariationSettings: "'FILL' 1" }}>
                  format_quote
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-outline">
                    {new Date(wish.created_at).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                  </span>
                  <button
                    onClick={async () => {
                      if (window.confirm(locale === 'ar' ? 'هل أنت متأكد من حذف هذه التهنئة؟' : 'Are you sure you want to delete this wish?')) {
                        const res = await deleteWish(wish.id);
                        if (!res.success) {
                          alert(locale === 'ar' ? 'فشل حذف التهنئة: ' + res.error : 'Failed to delete wish: ' + res.error);
                        }
                      }
                    }}
                    className="text-error hover:bg-error/10 p-1 rounded-full cursor-pointer flex items-center justify-center transition-colors border-0 bg-transparent"
                    title={locale === 'ar' ? 'حذف التهنئة' : 'Delete wish'}
                  >
                    <span className="material-symbols-outlined text-xs font-bold">delete</span>
                  </button>
                </div>
              </div>

              <p className="text-base text-primary leading-relaxed italic flex-grow mb-6">
                "{wish.message}"
              </p>

              <div className="border-t border-primary/10 pt-4 flex justify-between items-center text-xs text-secondary font-bold">
                <span>
                  {wish.is_anonymous ? (
                    <span className="text-[#c59e62]">{locale === 'ar' ? 'من مجهول 🔒' : 'From Anonymous 🔒'}</span>
                  ) : (
                    <span>{locale === 'ar' ? `من ${wish.author_name}` : `From ${wish.author_name}`}</span>
                  )}
                </span>
                {wish.relation && (
                  <span className="bg-black/5 px-2 py-0.5 text-[10px]">
                    {wish.relation}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-[#F5E6D3] dark:bg-surface-container border border-[#c59e62]/20 shadow-sm flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-6xl text-outline-variant">drafts</span>
          <h3 className="text-lg font-bold text-primary">
            {locale === 'ar' ? 'علبة الرسائل فارغة' : 'Your Mailbox is Empty'}
          </h3>
          <p className="text-secondary max-w-sm text-sm">
            {locale === 'ar' 
              ? 'لم تتلق أي تهانٍ معتمدة حتى الآن. شارك رابط ملفك مع أصدقائك وعائلتك ليكتبوا لك!' 
              : 'You have not received any approved wishes yet. Share your profile link with friends and family!'}
          </p>
        </div>
      )}
    </div>
  );
}
