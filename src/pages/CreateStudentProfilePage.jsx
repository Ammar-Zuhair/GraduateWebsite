import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { supabase, uploadImage } from '../lib/supabase';
import { useData } from '../context/DataContext';
import ImageCropperModal from '../components/ui/ImageCropperModal';

export default function CreateStudentProfilePage({ setActivePage }) {
  const { locale } = useLanguage();
  const { user } = useAuth();
  const { fetchAllData } = useData();

  const [nameAr, setNameAr] = useState('');
  const [major, setMajor] = useState('it');
  const [bio, setBio] = useState('');
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [profileImageInputType, setProfileImageInputType] = useState('file'); // file or url
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [cropperSrc, setCropperSrc] = useState(null);
  const [cropperConfig, setCropperConfig] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCropperSrc(URL.createObjectURL(file));
      setCropperConfig({
        aspectRatio: 1,
        circular: true,
        onCrop: (croppedFile) => {
          setProfileImageFile(croppedFile);
          setProfileImagePreview(URL.createObjectURL(croppedFile));
        }
      });
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nameAr) {
      setError(locale === 'ar' ? 'الاسم مطلوب' : 'Name is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      let avatarUrl = 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(nameAr);
      if (profileImageInputType === 'file' && profileImageFile) {
        avatarUrl = await uploadImage(profileImageFile, 'profiles');
      } else if (profileImageInputType === 'url' && profileImageUrl.trim()) {
        avatarUrl = profileImageUrl.trim();
      }

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
              <option value="acc">{locale === 'ar' ? 'محاسبة' : 'Accounting'}</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-on-surface-variant font-bold">
              {locale === 'ar' ? 'طريقة إضافة الصورة الشخصية' : 'Profile Image Method'}
            </label>
            <div className="flex gap-4 mb-2 text-xs">
              <label className="flex items-center gap-1 cursor-pointer">
                <input type="radio" checked={profileImageInputType === 'file'} onChange={() => setProfileImageInputType('file')} name="profileImageInputType" className="accent-[#c59e62]" />
                {locale === 'ar' ? 'تحميل ملف (من الهاتف)' : 'Upload File'}
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input type="radio" checked={profileImageInputType === 'url'} onChange={() => setProfileImageInputType('url')} name="profileImageInputType" className="accent-[#c59e62]" />
                {locale === 'ar' ? 'رابط إلكتروني (URL)' : 'Paste URL'}
              </label>
            </div>

            {profileImageInputType === 'file' ? (
              <div className="flex items-center gap-4 mt-1">
                <div className="w-14 h-14 rounded-full border border-primary/20 overflow-hidden bg-black/5 shrink-0 flex items-center justify-center relative group">
                  {profileImagePreview ? (
                    <>
                      <img src={profileImagePreview} alt="preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setProfileImageFile(null);
                          setProfileImagePreview('');
                        }}
                        className="absolute inset-0 bg-black/60 text-white text-[9px] font-bold opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200 border-0 cursor-pointer"
                      >
                        {locale === 'ar' ? 'حذف' : 'Remove'}
                      </button>
                    </>
                  ) : (
                    <span className="material-symbols-outlined text-2xl text-secondary">person</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-xs text-primary file:bg-primary file:text-white file:border-0 file:py-1.5 file:px-3 file:cursor-pointer hover:file:opacity-90 w-full"
                />
              </div>
            ) : (
              <input
                type="url"
                value={profileImageUrl}
                onChange={(e) => {
                  setProfileImageUrl(e.target.value);
                  setProfileImagePreview(e.target.value);
                }}
                className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-2 text-sm text-primary w-full"
                placeholder="https://..."
              />
            )}
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
      {cropperSrc && cropperConfig && (
        <ImageCropperModal
          imageSrc={cropperSrc}
          aspectRatio={cropperConfig.aspectRatio}
          circular={cropperConfig.circular}
          locale={locale}
          onClose={() => {
            setCropperSrc(null);
            setCropperConfig(null);
          }}
          onCrop={(croppedFile) => {
            cropperConfig.onCrop(croppedFile);
            setCropperSrc(null);
            setCropperConfig(null);
          }}
        />
      )}
    </main>
  );
}
