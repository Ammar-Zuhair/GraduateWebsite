import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import GalleryLightbox from '../components/ui/GalleryLightbox';

export default function StudentProfilePage({ studentId, onBack }) {
  const { locale } = useLanguage();
  const { students, wishes, memories, updateStudent, addMemory, deleteMemory } = useData();
  const { user } = useAuth();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Add Photo states
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoTitle, setPhotoTitle] = useState('');
  const [isAddingPhotoLoading, setIsAddingPhotoLoading] = useState(false);
  const [addPhotoError, setAddPhotoError] = useState('');

  const handleAddPhoto = async (e) => {
    e.preventDefault();
    if (!photoUrl.trim()) return;

    setIsAddingPhotoLoading(true);
    setAddPhotoError('');
    const result = await addMemory({
      student_id: student.id,
      title_ar: photoTitle.trim() || 'صورة من المعرض',
      title_en: photoTitle.trim() || 'Gallery Photo',
      url: photoUrl.trim(),
      category: 'campus',
      media_type: 'image'
    });
    setIsAddingPhotoLoading(false);

    if (result.success) {
      setIsAddingPhoto(false);
      setPhotoUrl('');
      setPhotoTitle('');
      alert(locale === 'ar' ? '✅ تم إضافة الصورة إلى معرضك بنجاح!' : '✅ Photo added to your gallery successfully!');
    } else {
      setAddPhotoError(result.error || (locale === 'ar' ? 'فشل إضافة الصورة.' : 'Failed to add photo.'));
    }
  };

  // Edit Profile modal states
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editProfileImage, setEditProfileImage] = useState('');
  const [editCoverImage, setEditCoverImage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Retrieve current student
  const student = students.find((g) => g.id === studentId) || students[0];

  if (!student) {
    return <div className="py-24 text-center">Loading...</div>;
  }

  const isOwner = user?.id === student.user_id;
  const isAdmin = user?.role === 'admin';
  const isApproved = student.status === 'approved' || (student.status === undefined && student.is_approved !== false);

  // If student profile is pending and user is neither owner nor admin, deny viewing
  if (!isApproved && !isOwner && !isAdmin) {
    return (
      <div className="w-full max-w-container-max px-4 py-24 text-center">
        <span className="material-symbols-outlined text-6xl text-[#c59e62] mb-4">pending_actions</span>
        <h2 className="text-2xl font-bold text-primary mb-2">
          {locale === 'ar' ? 'الملف الشخصي بانتظار الموافقة' : 'Profile Pending Approval'}
        </h2>
        <p className="text-secondary mb-8">
          {locale === 'ar' 
            ? 'هذا الحساب تم تسجيله حديثاً وهو بانتظار مراجعة وقبول لجنة الإدارة ليظهر للعامة.' 
            : 'This profile was recently created and is pending review and approval by the administrative committee.'}
        </p>
        <button onClick={onBack} className="bg-primary text-white font-bold px-6 py-2 border-0">
          {locale === 'ar' ? 'الرجوع للدليل' : 'Back to Directory'}
        </button>
      </div>
    );
  }

  // Calculate dedicated wishes (filter unapproved wishes unless user is admin)
  const studentWishes = wishes.filter(w => {
    const belongsToStudent = w.student_id === student.id;
    const isWishApproved = w.status === 'approved' || (w.status === undefined && w.is_approved !== false);
    return belongsToStudent && (isWishApproved || (isAdmin && w.status !== 'rejected'));
  });
  const wishesCount = studentWishes.length;

  // Student Gallery
  const studentGallery = memories.filter(m => m.student_id === student.id && m.media_type === 'image');

  const getMajorName = (major) => {
    if (major === 'it') return locale === 'ar' ? 'تقنية معلومات' : 'Information Technology';
    if (major === 'arch') return locale === 'ar' ? 'هندسة معمارية' : 'Architecture';
    return major;
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const startEditing = () => {
    setEditName(student[`name_${locale}`] || student.name_ar || '');
    setEditBio(student[`bio_${locale}`] || student.bio_ar || '');
    setEditProfileImage(student.profile_image || '');
    setEditCoverImage(student.cover_image || '');
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const res = await updateStudent(student.id, {
      name_ar: editName,
      bio_ar: editBio,
      profile_image: editProfileImage,
      cover_image: editCoverImage
    });
    setIsSaving(false);
    if (res.success) {
      setIsEditing(false);
    } else {
      alert(locale === 'ar' ? 'حدث خطأ أثناء حفظ التغييرات' : 'Error updating profile');
    }
  };

  // Setup social sharing templates
  const profileUrl = `${window.location.origin}/student/${student.id}`;
  const shareText = locale === 'ar' 
    ? `شاهد الملف الشخصي للخريج المتميز ${student[`name_${locale}`]} - دفعة 2026`
    : `Check out the graduation profile of ${student[`name_${locale}`]} - Class of 2026`;

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + profileUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(profileUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(profileUrl)}&text=${encodeURIComponent(shareText)}`
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=4e342e&bgcolor=f5e6d3&data=${encodeURIComponent(profileUrl)}`;

  return (
    <div className="w-full bg-background flex flex-col items-center">
      {/* Back navigation */}
      <div className="w-full max-w-container-max px-4 md:px-8 py-6">
        <button
          onClick={onBack}
          className="text-primary hover:text-[#c59e62] flex items-center gap-2 font-bold transition-colors border-0 cursor-pointer"
        >
          <span className="material-symbols-outlined font-bold">
            {locale === 'ar' ? 'arrow_forward' : 'arrow_back'}
          </span>
          {locale === 'ar' ? 'الرجوع للرئيسية' : 'Back to Home'}
        </button>
      </div>

      {/* Profile Header section */}
      <div className="w-full max-w-container-max px-4 md:px-8 flex flex-col items-center relative mb-12">
        {/* Cover Photo */}
        <div className="w-full h-48 md:h-64 overflow-hidden relative border border-[#c59e62]/10 shadow-sm bg-surface-container">
          <img
            src={student.cover_image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop'}
            alt=""
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-primary/10"></div>
        </div>

        {/* Profile layout details */}
        <div className="w-full flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 md:-mt-20 md:px-8 relative z-10 text-center md:text-right rtl:md:text-right ltr:md:text-left">
          {/* Avatar */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background shadow-md overflow-hidden bg-[#F5E6D3] shrink-0">
            <img
              src={student.profile_image || 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(student[`name_${locale}`])}
              alt={student[`name_${locale}`]}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mb-2 flex-grow flex flex-col md:flex-row justify-between items-center md:items-end w-full gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl text-primary font-bold leading-tight">
                {student[`name_${locale}`]}
              </h1>
              <p className="text-lg text-secondary flex items-center justify-center md:justify-start gap-2 mt-2 font-semibold">
                <span className="material-symbols-outlined text-[18px] text-[#c59e62]">school</span>
                {getMajorName(student.major)} | {locale === 'ar' ? 'دفعة 2026' : 'Class of 2026'}
              </p>
            </div>
            
            {isOwner && (
              <button
                onClick={startEditing}
                className="bg-primary text-[#c59e62] border border-[#c59e62] hover:bg-[#c59e62]/20 font-bold text-xs px-5 py-2.5 flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                {locale === 'ar' ? 'تعديل البيانات' : 'Edit Profile'}
              </button>
            )}
          </div>

          {/* QR Code */}
          <div className="bg-[#F5E6D3] p-3 border border-[#c59e62]/20 shadow-sm flex flex-col items-center shrink-0 mt-4 md:mt-0 select-none">
            <img
              src={qrCodeUrl}
              alt="QR Code"
              className="w-24 h-24 object-contain"
            />
            <span className="text-[10px] text-primary/70 font-bold mt-1.5 uppercase tracking-wider">
              {locale === 'ar' ? 'رمز الاستجابة السريع' : 'Personal QR Code'}
            </span>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="w-full max-w-container-max px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12 py-8 mb-24">
        
        {/* Left column: Bio & Sharing widgets */}
        <div className="lg:col-span-1 flex flex-col gap-8 self-start w-full">
          <div className="bg-[#F5E6D3] dark:bg-surface-container p-8 border border-outline-variant/20 flex flex-col gap-6 shadow-sm">
            <h3 className="text-xl text-primary font-bold border-b border-primary/10 pb-3">
              {locale === 'ar' ? 'النبذة الشخصية' : 'Personal Biography'}
            </h3>
            <p className="text-base text-on-surface-variant leading-relaxed italic">
              "{student[`bio_${locale}`] || (locale === 'ar' ? 'لا توجد نبذة شخصية.' : 'No bio available.')}"
            </p>
          </div>
        </div>

        {/* Right column: Gallery */}
        <div className="lg:col-span-2 flex flex-col gap-12 w-full">
          {/* Gallery */}
          <section className="flex flex-col gap-6 w-full">
            <div className="flex justify-between items-center border-b border-primary/10 pb-3">
              <h3 className="text-xl text-primary font-bold">
                {locale === 'ar' ? 'معرض الذكريات الخاصة بي' : 'My Personal Gallery'}
              </h3>
              {(isOwner || isAdmin) && (
                <button
                  onClick={() => setIsAddingPhoto(true)}
                  className="bg-primary text-[#c59e62] border border-[#c59e62]/40 hover:bg-[#c59e62]/20 text-xs font-bold px-4 py-2 border-0 cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm font-bold">add_photo_alternate</span>
                  {locale === 'ar' ? 'إضافة صورة للمعرض' : 'Add Photo'}
                </button>
              )}
            </div>
            {studentGallery.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {studentGallery.map((image, index) => (
                  <div
                    key={image.id}
                    onClick={() => handleThumbnailClick(index)}
                    className="aspect-square w-full overflow-hidden border border-[#c59e62]/30 cursor-pointer hover:opacity-90 transition-opacity relative group"
                  >
                    <img
                      src={image.url}
                      alt={image[`title_${locale}`]}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-primary/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2">
                      <span className="material-symbols-outlined text-white text-3xl font-bold">zoom_in</span>
                    </div>

                    {/* Delete button overlay */}
                    {(isOwner || isAdmin) && (
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (window.confirm(locale === 'ar' ? 'هل أنت متأكد من حذف هذه الصورة من معرضك الشخصي؟' : 'Delete this photo from your gallery?')) {
                            const res = await deleteMemory(image.id);
                            if (res && !res.success) {
                              alert((locale === 'ar' ? 'فشل حذف الصورة: ' : 'Failed to delete photo: ') + res.error);
                            }
                          }
                        }}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 transition-colors z-20 shadow-md border-0 cursor-pointer flex items-center justify-center"
                        title={locale === 'ar' ? 'حذف الصورة' : 'Delete Photo'}
                      >
                        <span className="material-symbols-outlined text-sm font-bold">delete</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-surface-container border border-outline-variant/10 text-secondary text-sm font-semibold">
                {locale === 'ar' ? 'لم يتم تحميل أي صور بعد لهذا الخريج.' : 'No photos uploaded yet for this graduate.'}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/65 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#F5E6D3] dark:bg-surface-container border border-[#c59e62]/20 p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-300">
            <button 
              onClick={() => setIsEditing(false)}
              className="absolute top-4 right-4 text-primary hover:text-secondary bg-transparent border-0 cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            
            <h2 className="text-xl font-bold text-primary mb-6 border-b border-[#c59e62]/20 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined">edit_square</span>
              {locale === 'ar' ? 'تعديل البيانات الشخصية' : 'Edit Personal Profile'}
            </h2>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-secondary font-bold">{locale === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-1.5 text-sm text-primary w-full"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-secondary font-bold">{locale === 'ar' ? 'الصورة الشخصية (رابط URL)' : 'Profile Image URL'}</label>
                <input 
                  type="url" 
                  value={editProfileImage}
                  onChange={(e) => setEditProfileImage(e.target.value)}
                  className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-1.5 text-sm text-primary w-full"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-secondary font-bold">{locale === 'ar' ? 'صورة الغلاف (رابط URL)' : 'Cover Image URL'}</label>
                <input 
                  type="url" 
                  value={editCoverImage}
                  onChange={(e) => setEditCoverImage(e.target.value)}
                  className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-1.5 text-sm text-primary w-full"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-secondary font-bold">{locale === 'ar' ? 'نبذة قصيرة / مقولة التخرج' : 'Short Bio / Graduation Quote'}</label>
                <textarea 
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows="3"
                  className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-1.5 text-sm text-primary resize-none w-full"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-outline-variant/30 text-secondary text-xs font-bold hover:bg-black/5 bg-transparent"
                >
                  {locale === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-[#c59e62] text-primary hover:bg-[#ffdeae] text-xs font-bold flex items-center gap-1.5 border-0"
                >
                  {isSaving && <span className="material-symbols-outlined animate-spin text-[14px]">refresh</span>}
                  {locale === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <GalleryLightbox
          image={studentGallery[currentIndex]}
          onClose={() => setLightboxOpen(false)}
          onPrev={() => setCurrentIndex((prev) => (prev - 1 + studentGallery.length) % studentGallery.length)}
          onNext={() => setCurrentIndex((prev) => (prev + 1) % studentGallery.length)}
        />
      )}
      {/* Add Photo Modal */}
      {isAddingPhoto && (
        <div className="fixed inset-0 bg-black/65 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#F5E6D3] dark:bg-surface-container border border-[#c59e62]/20 p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-300">
            <button 
              onClick={() => {
                setIsAddingPhoto(false);
                setPhotoUrl('');
                setPhotoTitle('');
                setAddPhotoError('');
              }}
              className="absolute top-4 right-4 text-primary hover:text-secondary bg-transparent border-0 cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            
            <h2 className="text-xl font-bold text-primary mb-6 border-b border-[#c59e62]/20 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#c59e62]">add_photo_alternate</span>
              {locale === 'ar' ? 'إضافة صورة للمعرض الخاص بي' : 'Add Photo to My Gallery'}
            </h2>
            
            {addPhotoError && (
              <div className="mb-4 p-3 bg-error-container border border-error/20 text-error font-bold text-xs text-center">
                {addPhotoError}
              </div>
            )}

            <form onSubmit={handleAddPhoto} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-secondary font-bold">{locale === 'ar' ? 'رابط الصورة الإلكتروني (URL)' : 'Photo Image URL'}</label>
                <input 
                  type="url" 
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-1.5 text-sm text-primary w-full"
                  placeholder="https://..."
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-secondary font-bold">{locale === 'ar' ? 'عنوان الصورة (اختياري)' : 'Photo Title (Optional)'}</label>
                <input 
                  type="text" 
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-1.5 text-sm text-primary w-full"
                  placeholder={locale === 'ar' ? 'مثال: يوم التخرج، مناقشة المشروع...' : 'e.g. Graduation Day, Project Presentation...'}
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => {
                    setIsAddingPhoto(false);
                    setPhotoUrl('');
                    setPhotoTitle('');
                    setAddPhotoError('');
                  }}
                  className="px-4 py-2 border border-outline-variant/30 text-secondary text-xs font-bold hover:bg-black/5 bg-transparent"
                >
                  {locale === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button 
                  type="submit"
                  disabled={isAddingPhotoLoading}
                  className="px-6 py-2 bg-[#c59e62] text-primary hover:bg-[#ffdeae] text-xs font-bold flex items-center gap-1.5 border-0"
                >
                  {isAddingPhotoLoading && <span className="material-symbols-outlined animate-spin text-[14px]">refresh</span>}
                  {locale === 'ar' ? 'إضافة الصورة' : 'Add Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
