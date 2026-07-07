import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function StudentRegisterPage({ setActivePage }) {
  const { locale } = useLanguage();
  const { registerStudent } = useAuth();

  // Extract query token
  const queryParams = new URLSearchParams(window.location.search);
  const inviteToken = queryParams.get('token');
  const isAdminInvite = inviteToken === 'admin2026-secure-invite';
  const isValidInvite = inviteToken === 'grad2026-secure-invite' || isAdminInvite;

  // Form states
  const [studentNameAr, setStudentNameAr] = useState('');
  const [studentDept, setStudentDept] = useState('it');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [studentImage, setStudentImage] = useState('');
  const [studentBioAr, setStudentBioAr] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!studentNameAr || !studentEmail || !studentPassword) {
      setFormError(locale === 'ar' ? 'يرجى ملء جميع الحقول الإلزامية المطلوبة.' : 'Please fill out all mandatory fields.');
      return;
    }

    if (studentPassword.length < 6) {
      setFormError(locale === 'ar' ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.' : 'Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    const avatarUrl = studentImage.trim() || 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(studentNameAr);
    
    // Register as admin or student depending on the invite link token
    const result = await registerStudent(studentEmail, studentPassword, {
      name_ar: studentNameAr,
      name_en: studentNameAr,
      major: studentDept,
      bio_ar: studentBioAr,
      bio_en: studentBioAr,
      profile_image: avatarUrl,
      role: isAdminInvite ? 'admin' : 'student'
    });

    setIsSubmitting(false);

    if (result.success) {
      setFormSuccess(true);
      setTimeout(() => {
        // Force full page reload to boot the logged-in user session correctly
        window.location.href = window.location.origin + (isAdminInvite ? '?login=true' : '');
      }, 2500);
    } else {
      setFormError(result.error || (locale === 'ar' ? 'حدث خطأ. حاول مرة أخرى.' : 'An error occurred. Please try again.'));
    }
  };

  // If token is invalid or missing, show access denied
  if (!isValidInvite) {
    return (
      <main className="flex-grow flex flex-col items-center justify-center w-full max-w-container-max mx-auto px-4 py-24 select-none">
        <div className="w-full max-w-md bg-error-container border border-error/20 p-10 text-center shadow-md flex flex-col items-center gap-6">
          <span className="material-symbols-outlined text-6xl text-error">gpp_bad</span>
          <h2 className="text-xl text-primary font-bold">
            {locale === 'ar' ? 'رابط دعوة غير صالح' : 'Invalid Invitation Link'}
          </h2>
          <p className="text-sm text-on-error-container/80 leading-relaxed">
            {locale === 'ar' 
              ? 'عذراً، هذا الرابط منتهي الصلاحية أو غير مصرح به. التسجيل متاح فقط للأشخاص المخولين بالوصول.' 
              : 'Sorry, this invitation link is invalid or expired. Registration is restricted to authorized personnel.'}
          </p>
          <button
            onClick={() => setActivePage('home')}
            className="border border-error text-on-error-container bg-transparent text-sm px-6 py-3 hover:bg-error/5 transition-all font-bold cursor-pointer"
          >
            {locale === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow flex flex-col items-center justify-center w-full max-w-container-max mx-auto px-4 py-16 md:py-24">
      <div className="w-full max-w-lg bg-[#F5E6D3] dark:bg-surface-container p-8 md:p-12 border border-[#c59e62]/20 shadow-md">
        
        <div className="text-center mb-8">
          <span className="material-symbols-outlined text-5xl text-[#c59e62] mb-3" style={{ fontVariationSettings: "'FILL' 1" }}>
            {isAdminInvite ? 'admin_panel_settings' : 'workspace_premium'}
          </span>
          <h2 className="text-2xl text-primary font-bold">
            {isAdminInvite 
              ? (locale === 'ar' ? 'تسجيل حساب إدارة جديد' : 'Register Admin Account')
              : (locale === 'ar' ? 'تسجيل خريج جديد' : 'Graduate Registration')}
          </h2>
          <p className="text-sm text-secondary mt-1 font-semibold">
            {isAdminInvite
              ? (locale === 'ar' ? 'قم بإنشاء حساب لجنة الإشراف والتحكم بالموقع.' : 'Create an administrative supervisor account.')
              : (locale === 'ar' ? 'قم بإنشاء حساب الخريج الخاص بك لتنضم لدليل الدفعة الرسمي.' : 'Create your graduate account to join the official batch directory.')}
          </p>
        </div>

        {formError && (
          <div className="mb-6 p-3 bg-error-container border border-error/20 text-error font-bold text-sm">
            {formError}
          </div>
        )}
        {formSuccess && (
          <div className="mb-6 p-3 bg-[#efe0cd] border border-[#c59e62] text-primary font-bold text-sm text-center">
            {locale === 'ar' 
              ? '✅ تم تسجيل حسابك بنجاح! جاري تحويلك لوحة التحكم...' 
              : '✅ Account created successfully! Redirecting...'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-on-surface-variant font-bold">
                {locale === 'ar' ? 'الاسم الكامل' : 'Full Name'} <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={studentNameAr}
                onChange={(e) => setStudentNameAr(e.target.value)}
                className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-2 text-sm text-primary w-full"
                placeholder={isAdminInvite ? (locale === 'ar' ? 'اسم المشرف' : 'Admin Name') : "محمد عبدالله"}
                required
              />
            </div>
          </div>

          {!isAdminInvite && (
            <div className="flex flex-col gap-2 animate-in fade-in duration-300">
              <label className="text-sm text-on-surface-variant font-bold">
                {locale === 'ar' ? 'التخصص الأكاديمي' : 'Major Department'}
              </label>
              <select
                value={studentDept}
                onChange={(e) => setStudentDept(e.target.value)}
                className="bg-surface-container border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-2.5 px-3 text-on-surface cursor-pointer"
              >
                <option value="it">{locale === 'ar' ? 'تقنية معلومات' : 'Information Technology'}</option>
                <option value="arch">{locale === 'ar' ? 'هندسة معمارية' : 'Architecture'}</option>
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-on-surface-variant font-bold">
                {locale === 'ar' ? 'البريد الإلكتروني' : 'Email'} <span className="text-error">*</span>
              </label>
              <input
                type="email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-2 text-sm text-primary w-full"
                placeholder="email@domain.com"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-on-surface-variant font-bold">
                {locale === 'ar' ? 'كلمة المرور' : 'Password'} <span className="text-error">*</span>
              </label>
              <input
                type="password"
                value={studentPassword}
                onChange={(e) => setStudentPassword(e.target.value)}
                className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-2 text-sm text-primary w-full"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {!isAdminInvite && (
            <div className="flex flex-col gap-5 animate-in fade-in duration-300">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-on-surface-variant font-bold">
                  {locale === 'ar' ? 'رابط الصورة الشخصية (اختياري)' : 'Profile Image URL (optional)'}
                </label>
                <input
                  type="url"
                  value={studentImage}
                  onChange={(e) => setStudentImage(e.target.value)}
                  className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-2 text-sm text-primary w-full"
                  placeholder="https://..."
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-on-surface-variant font-bold">
                  {locale === 'ar' ? 'نبذة قصيرة / مقولة التخرج' : 'Short Bio / Graduation Quote'}
                </label>
                <textarea
                  value={studentBioAr}
                  onChange={(e) => setStudentBioAr(e.target.value)}
                  rows="3"
                  className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-2 text-sm text-primary resize-none w-full"
                  placeholder={locale === 'ar' ? 'مقولة أو فكرة تلخص مسيرتك الجامعية...' : 'A quote summarizing your university journey...'}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || formSuccess}
            className="bg-primary text-white text-sm py-4 mt-4 hover:bg-primary/90 transition-all font-bold uppercase cursor-pointer border-0 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting && <span className="material-symbols-outlined animate-spin text-lg">refresh</span>}
            {isSubmitting 
              ? (locale === 'ar' ? 'جاري التسجيل...' : 'Registering...')
              : (isAdminInvite 
                  ? (locale === 'ar' ? 'إنشاء حساب الإشراف' : 'Register Admin Account') 
                  : (locale === 'ar' ? 'إنشاء حساب طالب خريج' : 'Register Graduate Account'))
            }
          </button>
        </form>
      </div>
    </main>
  );
}
