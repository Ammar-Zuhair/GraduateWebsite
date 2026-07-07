import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useData } from '../context/DataContext';

export default function CreateStudentProfilePage({ setActivePage }) {
  const { locale } = useLanguage();
  const { user } = useAuth();
  const { fetchAllData } = useData();

  const [nameAr, setNameAr] = useState('');
  const [major, setMajor] = useState('it');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nameAr) {
      setError(locale === 'ar' ? 'الاسم مطلوب' : 'Name is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const avatarUrl = profileImage.trim() || 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(nameAr);

    try {
      const { error: dbError } = await supabase.from('students').insert([
        {
          user_id: user.id,
          name_ar: nameAr,
          name_en: nameAr,
          major: major,
          bio_ar: bio,
          bio_en: bio,
          profile_image: avatarUrl,
          cover_image: '',
          is_approved: false // requires admin approval
        }
      ]);

      if (dbError) throw dbError;

      // Refresh context data
      if (fetchAllData) await fetchAllData();
      
      setActivePage('my-profile');
    } catch (err) {
      setError(err.message || 'Error creating profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-grow flex flex-col items-center justify-center w-full max-w-container-max mx-auto px-4 py-16">
      <div className="w-full max-w-lg bg-[#F5E6D3] dark:bg-surface-container p-8 border border-[#c59e62]/20 shadow-md">
        <div className="text-center mb-8">
          <span className="material-symbols-outlined text-5xl text-[#c59e62] mb-3">badge</span>
          <h2 className="text-2xl text-primary font-bold">
            {locale === 'ar' ? 'إنشاء ملف خريج' : 'Create Graduate Profile'}
          </h2>
          <p className="text-sm text-secondary mt-1">
            {locale === 'ar' 
              ? 'يرجى إكمال بيانات ملفك الشخصي لتظهر في دليل الخريجين.' 
              : 'Please complete your profile details to appear in the directory.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-error-container border border-error/20 text-error font-bold text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-on-surface-variant font-bold">
              {locale === 'ar' ? 'الاسم الكامل' : 'Full Name'} <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-2 text-sm text-primary w-full"
              placeholder="محمد عبدالله"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-on-surface-variant font-bold">
              {locale === 'ar' ? 'التخصص الأكاديمي' : 'Major Department'}
            </label>
            <select
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="bg-surface-container border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-2.5 px-3 text-on-surface cursor-pointer"
            >
              <option value="it">{locale === 'ar' ? 'تقنية معلومات' : 'Information Technology'}</option>
              <option value="arch">{locale === 'ar' ? 'هندسة معمارية' : 'Architecture'}</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-on-surface-variant font-bold">
              {locale === 'ar' ? 'رابط الصورة الشخصية (اختياري)' : 'Profile Image URL (optional)'}
            </label>
            <input
              type="url"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-2 text-sm text-primary w-full"
              placeholder="https://..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-on-surface-variant font-bold">
              {locale === 'ar' ? 'نبذة قصيرة / مقولة التخرج' : 'Short Bio / Graduation Quote'}
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows="3"
              className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-2 text-sm text-primary resize-none w-full"
              placeholder={locale === 'ar' ? 'اكتب مقولة أو فكرة تلخص مسيرتك الجامعية...' : 'A quote summarizing your university journey...'}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-white text-sm py-4 mt-4 hover:bg-primary/90 transition-all font-bold uppercase cursor-pointer border-0 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isSubmitting && <span className="material-symbols-outlined animate-spin text-lg">refresh</span>}
            {isSubmitting 
              ? (locale === 'ar' ? 'جاري الحفظ...' : 'Saving...')
              : (locale === 'ar' ? 'إنشاء الملف الشخصي' : 'Create Profile')
            }
          </button>
        </form>
      </div>
    </main>
  );
}
