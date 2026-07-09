import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { supabase } from '../lib/supabase';

export default function AdminPage() {
  const { locale } = useLanguage();
  const { 
    students, memories, wishes, sponsors, doctors,
    deleteStudent, deleteWish, addMemory, deleteMemory, updateMemory,
    updateStudentStatus, updateStudent,
    addSponsorItem, deleteSponsorItem, updateSponsorItem,
    addDoctor, updateDoctorImage, deleteDoctor
  } = useData();

  // Doctor form states
  const [docNameAr, setDocNameAr] = useState('');
  const [docTitleAr, setDocTitleAr] = useState('');
  const [docSpeechAr, setDocSpeechAr] = useState('');
  const [docImageInputType, setDocImageInputType] = useState('url'); // url or file
  const [docImageUrl, setDocImageUrl] = useState('');
  const [docImageFile, setDocImageFile] = useState(null);
  const [docSuccess, setDocSuccess] = useState(false);
  const [isSubmittingDoctor, setIsSubmittingDoctor] = useState(false);

  // Edit Doctor Image modal states
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [editDocImageInputType, setEditDocImageInputType] = useState('url'); // url or file
  const [editDocImageUrl, setEditDocImageUrl] = useState('');
  const [editDocImageFile, setEditDocImageFile] = useState(null);
  const [isSavingDoctorImage, setIsSavingDoctorImage] = useState(false);
  const [doctorImageEditSuccess, setDoctorImageEditSuccess] = useState(false);
  const [doctorImageEditError, setDoctorImageEditError] = useState('');

  const uploadImage = async (file) => {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
    const filePath = `doctors/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('gallery')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    if (!docNameAr.trim() || !docSpeechAr.trim() || !docTitleAr.trim()) return;

    setIsSubmittingDoctor(true);
    try {
      let finalImageUrl = docImageUrl;
      if (docImageInputType === 'file' && docImageFile) {
        finalImageUrl = await uploadImage(docImageFile);
      }

      const result = await addDoctor({
        name_ar: docNameAr,
        name_en: docNameAr,
        title_ar: docTitleAr,
        title_en: docTitleAr,
        speech_ar: docSpeechAr,
        speech_en: docSpeechAr,
        image_url: finalImageUrl
      });

      if (result.success) {
        setDocNameAr('');
        setDocTitleAr('');
        setDocSpeechAr('');
        setDocImageUrl('');
        setDocImageFile(null);
        setDocSuccess(true);
        setTimeout(() => setDocSuccess(false), 3000);
      } else {
        alert(locale === 'ar' ? 'حدث خطأ: ' + result.error : 'Error: ' + result.error);
      }
    } catch (err) {
      alert(locale === 'ar' ? 'خطأ في الرفع: ' + err.message : 'Upload error: ' + err.message);
    } finally {
      setIsSubmittingDoctor(false);
    }
  };

  const startEditingDoctor = (doc) => {
    setEditingDoctor(doc);
    setEditDocImageUrl(doc.image_url || '');
    setEditDocImageInputType('url');
    setEditDocImageFile(null);
    setDoctorImageEditSuccess(false);
    setDoctorImageEditError('');
  };

  const handleSaveDoctorImage = async (e) => {
    e.preventDefault();
    if (!editingDoctor) return;

    setIsSavingDoctorImage(true);
    setDoctorImageEditError('');
    setDoctorImageEditSuccess(false);

    try {
      let finalImageUrl = editDocImageUrl;
      if (editDocImageInputType === 'file' && editDocImageFile) {
        finalImageUrl = await uploadImage(editDocImageFile);
      }

      const result = await updateDoctorImage(editingDoctor.id, finalImageUrl);
      if (result.success) {
        setDoctorImageEditSuccess(true);
        setTimeout(() => {
          setDoctorImageEditSuccess(false);
          setEditingDoctor(null);
        }, 1500);
      } else {
        setDoctorImageEditError(result.error || (locale === 'ar' ? 'فشل حفظ الصورة.' : 'Failed to save image.'));
      }
    } catch (err) {
      setDoctorImageEditError(err.message);
    } finally {
      setIsSavingDoctorImage(false);
    }
  };

  // Student Edit States
  const [editingStudent, setEditingStudent] = useState(null);
  const [editName, setEditName] = useState('');
  const [editMajor, setEditMajor] = useState('it');
  const [editProfileImage, setEditProfileImage] = useState('');
  const [editCoverImage, setEditCoverImage] = useState('');
  const [editBio, setEditBio] = useState('');
  const [isSavingStudent, setIsSavingStudent] = useState(false);
  const [studentEditSuccess, setStudentEditSuccess] = useState(false);
  const [studentEditError, setStudentEditError] = useState('');

  const startEditingStudent = (s) => {
    setEditingStudent(s);
    setEditName(s.name_ar || '');
    setEditMajor(s.major || 'it');
    setEditProfileImage(s.profile_image || '');
    setEditCoverImage(s.cover_image || '');
    setEditBio(s.bio_ar || '');
    setStudentEditSuccess(false);
    setStudentEditError('');
  };

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    if (!editingStudent) return;

    setIsSavingStudent(true);
    setStudentEditError('');
    setStudentEditSuccess(false);

    const result = await updateStudent(editingStudent.id, {
      name_ar: editName,
      major: editMajor,
      profile_image: editProfileImage,
      cover_image: editCoverImage,
      bio_ar: editBio
    });
    setIsSavingStudent(false);

    if (result.success) {
      setStudentEditSuccess(true);
      setTimeout(() => {
        setStudentEditSuccess(false);
        setEditingStudent(null);
      }, 1500);
    } else {
      setStudentEditError(result.error || (locale === 'ar' ? 'فشل حفظ التعديلات.' : 'Failed to save changes.'));
    }
  };

  // Tabs: students, wishes, memories
  const [activeTab, setActiveTab] = useState('students');

  // Sub-tabs for filtering students: pending, approved, rejected
  const [studentFilter, setStudentFilter] = useState('pending');

  // Add memory form states
  const [memTitleAr, setMemTitleAr] = useState('');
  const [memTitleEn, setMemTitleEn] = useState('');
  const [memUrl, setMemUrl] = useState('');
  const [memCat, setMemCat] = useState('ceremony');
  const [memType, setMemType] = useState('image');
  const [memCoverUrl, setMemCoverUrl] = useState('');
  const [memSuccess, setMemSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add sponsor form states
  const [spName, setSpName] = useState('');
  const [spLogo, setSpLogo] = useState('');
  const [spDesc, setSpDesc] = useState('');
  const [spLink, setSpLink] = useState('');
  const [spTier, setSpTier] = useState('gold');
  const [spSuccess, setSpSuccess] = useState(false);
  const [isSubmittingSponsor, setIsSubmittingSponsor] = useState(false);

  const handleAddSponsor = async (e) => {
    e.preventDefault();
    if (!spName.trim() || !spLogo.trim()) return;

    setIsSubmittingSponsor(true);
    const result = await addSponsorItem({
      name: spName,
      logo: spLogo,
      desc: spDesc,
      link: spLink,
      tier: spTier
    });
    setIsSubmittingSponsor(false);

    if (result && result.success !== false) {
      setSpName('');
      setSpLogo('');
      setSpDesc('');
      setSpLink('');
      setSpTier('gold');
      setSpSuccess(true);
      setTimeout(() => setSpSuccess(false), 3000);
    } else {
      alert(locale === 'ar' ? 'حدث خطأ أثناء إضافة الداعم.' : 'Error adding sponsor.');
    }
  };

  // Edit sponsor states
  const [editingSponsor, setEditingSponsor] = useState(null);
  const [editSpName, setEditSpName] = useState('');
  const [editSpLogo, setEditSpLogo] = useState('');
  const [editSpDesc, setEditSpDesc] = useState('');
  const [editSpLink, setEditSpLink] = useState('');
  const [editSpTier, setEditSpTier] = useState('gold');
  const [isSavingSponsor, setIsSavingSponsor] = useState(false);
  const [sponsorEditSuccess, setSponsorEditSuccess] = useState(false);
  const [sponsorEditError, setSponsorEditError] = useState('');

  const startEditingSponsor = (sp) => {
    setEditingSponsor(sp);
    setEditSpName(sp.name_ar || '');
    setEditSpLogo(sp.logo_url || '');
    setEditSpDesc(sp.description_ar || '');
    setEditSpLink(sp.website_link || '');
    setEditSpTier(sp.tier || 'gold');
    setSponsorEditSuccess(false);
    setSponsorEditError('');
  };

  const handleSaveSponsor = async (e) => {
    e.preventDefault();
    if (!editingSponsor) return;
    setIsSavingSponsor(true);
    setSponsorEditError('');
    const result = await updateSponsorItem(editingSponsor.id, {
      name: editSpName,
      logo: editSpLogo,
      desc: editSpDesc,
      link: editSpLink,
      tier: editSpTier
    });
    setIsSavingSponsor(false);
    if (result.success) {
      setSponsorEditSuccess(true);
      setTimeout(() => { setSponsorEditSuccess(false); setEditingSponsor(null); }, 1500);
    } else {
      setSponsorEditError(result.error || (locale === 'ar' ? 'فشل حفظ التعديلات.' : 'Failed to save changes.'));
    }
  };

  const getMajorName = (major) => {
    if (major === 'it') return locale === 'ar' ? 'تقنية معلومات' : 'Information Technology';
    if (major === 'arch') return locale === 'ar' ? 'هندسة معمارية' : 'Architecture';
    if (major === 'acc') return locale === 'ar' ? 'محاسبة' : 'Accounting';
    return major;
  };

  const handleAddMemory = async (e) => {
    e.preventDefault();
    if (!memTitleAr.trim() || !memTitleEn.trim() || !memUrl.trim()) return;

    setIsSubmitting(true);
    const result = await addMemory({
      student_id: null,
      title_ar: memTitleAr,
      title_en: memTitleEn,
      url: memUrl,
      category: memCat,
      media_type: memType,
      cover_url: memCoverUrl || null
    });
    setIsSubmitting(false);

    if (result.success) {
      setMemTitleAr('');
      setMemTitleEn('');
      setMemUrl('');
      setMemCoverUrl('');
      setMemSuccess(true);
      setTimeout(() => setMemSuccess(false), 3000);
    } else {
      const errMsg = result.error?.message || result.error || (locale === 'ar' ? 'فشل حفظ التعديلات' : 'Failed to save changes');
      alert((locale === 'ar' ? 'حدث خطأ أثناء إضافة الذكرى: ' : 'Error adding memory: ') + errMsg);
    }
  };

  // Edit memory states
  const [editingMemory, setEditingMemory] = useState(null);
  const [editMemTitleAr, setEditMemTitleAr] = useState('');
  const [editMemTitleEn, setEditMemTitleEn] = useState('');
  const [editMemUrl, setEditMemUrl] = useState('');
  const [editMemCat, setEditMemCat] = useState('ceremony');
  const [editMemType, setEditMemType] = useState('image');
  const [editMemCoverUrl, setEditMemCoverUrl] = useState('');
  const [isSavingMemory, setIsSavingMemory] = useState(false);
  const [memoryEditSuccess, setMemoryEditSuccess] = useState(false);
  const [memoryEditError, setMemoryEditError] = useState('');

  const startEditingMemory = (m) => {
    setEditingMemory(m);
    setEditMemTitleAr(m.title_ar || '');
    setEditMemTitleEn(m.title_en || '');
    setEditMemUrl(m.url || '');
    setEditMemCat(m.category || 'ceremony');
    setEditMemType(m.media_type || 'image');
    setEditMemCoverUrl(m.cover_url || '');
    setMemoryEditSuccess(false);
    setMemoryEditError('');
  };

  const handleSaveMemory = async (e) => {
    e.preventDefault();
    if (!editingMemory) return;
    setIsSavingMemory(true);
    setMemoryEditError('');
    const result = await updateMemory(editingMemory.id, {
      title_ar: editMemTitleAr,
      title_en: editMemTitleEn,
      url: editMemUrl,
      category: editMemCat,
      media_type: editMemType,
      cover_url: editMemCoverUrl || null
    });
    setIsSavingMemory(false);
    if (result.success) {
      setMemoryEditSuccess(true);
      setTimeout(() => {
        setMemoryEditSuccess(false);
        setEditingMemory(null);
      }, 1500);
    } else {
      setMemoryEditError(result.error || (locale === 'ar' ? 'فشل حفظ التعديلات.' : 'Failed to save changes.'));
    }
  };

  // Filter students based on status and is_approved fallback
  const getFilteredStudents = () => {
    return students.filter(s => {
      const isPending = s.status === 'pending' || (s.status === undefined && s.is_approved === false);
      const isApproved = s.status === 'approved' || (s.status === undefined && s.is_approved !== false);
      const isRejected = s.status === 'rejected';

      if (studentFilter === 'pending') return isPending;
      if (studentFilter === 'approved') return isApproved;
      if (studentFilter === 'rejected') return isRejected;
      return true;
    });
  };

  const filteredStudentsList = getFilteredStudents();

  return (
    <div className="w-full max-w-container-max mx-auto px-4 md:px-8 py-12 md:py-24">
      <header className="mb-12 border-b border-[#c59e62]/20 pb-6 text-center md:text-right rtl:md:text-right ltr:md:text-left">
        <h1 className="text-2xl md:text-3xl text-primary font-bold">
          {locale === 'ar' ? 'لوحة التحكم وإدارة البوابة الرسمية' : 'Admin Control Panel Dashboard'}
        </h1>
        <p className="text-secondary text-sm mt-2 font-bold">
          {locale === 'ar' ? 'إدارة محتوى الموقع، واعتماد الطلاب والصور.' : 'Manage site content, edit graduates, and accept galleries.'}
        </p>
      </header>

      {/* Tabs list */}
      <section className="flex flex-wrap border-b border-primary/10 mb-8 select-none">
        <button
          onClick={() => setActiveTab('students')}
          className={`px-6 py-3 text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer border-0 ${
            activeTab === 'students' 
              ? 'border-b-2 border-[#c59e62] text-primary' 
              : 'text-secondary hover:text-primary bg-transparent'
          }`}
        >
          {locale === 'ar' ? 'إدارة الطلاب' : 'Graduates List'}
        </button>
        <button
          onClick={() => setActiveTab('memories')}
          className={`px-6 py-3 text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer border-0 ${
            activeTab === 'memories' 
              ? 'border-b-2 border-[#c59e62] text-primary' 
              : 'text-secondary hover:text-primary bg-transparent'
          }`}
        >
          {locale === 'ar' ? 'إدارة الصور والذكريات' : 'Manage Gallery'}
        </button>
        <button
          onClick={() => setActiveTab('sponsors')}
          className={`px-6 py-3 text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer border-0 ${
            activeTab === 'sponsors' 
              ? 'border-b-2 border-[#c59e62] text-primary' 
              : 'text-secondary hover:text-primary bg-transparent'
          }`}
        >
          {locale === 'ar' ? 'الداعمون' : 'Sponsors'}
        </button>
        <button
          onClick={() => setActiveTab('doctors')}
          className={`px-6 py-3 text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer border-0 ${
            activeTab === 'doctors' 
              ? 'border-b-2 border-[#c59e62] text-primary' 
              : 'text-secondary hover:text-primary bg-transparent'
          }`}
        >
          {locale === 'ar' ? 'إدارة الدكاترة' : 'Manage Doctors'}
        </button>
      </section>

      {/* PANEL 1: Graduates */}
      {activeTab === 'students' && (
        <div className="bg-[#F5E6D3] dark:bg-surface-container p-6 md:p-8 border border-outline-variant/20 shadow-sm w-full">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h3 className="text-lg text-primary font-bold">
              {locale === 'ar' ? 'دليل الطلاب الحاليين' : 'Current Student Directory'}
            </h3>
            
            {/* Student sub-tabs switcher */}
            <div className="flex gap-2 bg-black/5 p-1 select-none">
              {['pending', 'approved', 'rejected'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setStudentFilter(tab)}
                  className={`px-4 py-1.5 text-xs font-bold transition-all border-0 cursor-pointer ${
                    studentFilter === tab 
                      ? 'bg-[#c59e62] text-primary shadow' 
                      : 'text-secondary hover:text-primary bg-transparent'
                  }`}
                >
                  {tab === 'pending' && (locale === 'ar' ? 'معلّقة' : 'Pending')}
                  {tab === 'approved' && (locale === 'ar' ? 'مقبولة' : 'Approved')}
                  {tab === 'rejected' && (locale === 'ar' ? 'مرفوضة' : 'Rejected')}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-right rtl:text-right ltr:text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-primary/20 font-bold text-secondary uppercase tracking-widest text-xs">
                  <th className="py-3 px-4">{locale === 'ar' ? 'الصورة' : 'Avatar'}</th>
                  <th className="py-3 px-4">{locale === 'ar' ? 'الاسم' : 'Name'}</th>
                  <th className="py-3 px-4">{locale === 'ar' ? 'التخصص' : 'Department'}</th>
                  <th className="py-3 px-4">{locale === 'ar' ? 'التحكم والتعديل' : 'Moderation'}</th>
                  <th className="py-3 px-4">{locale === 'ar' ? 'حذف نهائي' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudentsList.map(s => (
                  <tr key={s.id} className="border-b border-primary/10 hover:bg-primary/5 font-semibold text-primary">
                    <td className="py-3 px-4">
                      <img src={s.profile_image} alt="" className="w-10 h-10 rounded-full object-cover border border-outline-variant/30" />
                    </td>
                    <td className="py-3 px-4 font-bold">{s[`name_${locale}`]}</td>
                    <td className="py-3 px-4">{getMajorName(s.major)}</td>
                    <td className="py-3 px-4 flex gap-2">
                      <button
                        onClick={() => startEditingStudent(s)}
                        className="bg-[#efe0cd] text-primary hover:bg-[#c59e62]/20 text-[10px] font-bold px-3 py-1.5 border-0 rounded cursor-pointer"
                      >
                        {locale === 'ar' ? 'تعديل' : 'Edit'}
                      </button>
                      {s.status !== 'approved' && (
                        <button
                          onClick={() => updateStudentStatus(s.id, 'approved')}
                          className="bg-primary text-[#c59e62] hover:bg-primary/95 text-[10px] font-bold px-3 py-1.5 border-0 cursor-pointer"
                        >
                          {locale === 'ar' ? 'قبول' : 'Approve'}
                        </button>
                      )}
                      {s.status !== 'rejected' && (
                        <button
                          onClick={() => updateStudentStatus(s.id, 'rejected')}
                          className="bg-red-950 text-error border border-error/20 hover:bg-red-900 text-[10px] font-bold px-3 py-1.5 cursor-pointer"
                        >
                          {locale === 'ar' ? 'رفض' : 'Reject'}
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={async () => {
                          if (window.confirm(locale === 'ar' ? 'هل أنت متأكد من حذف هذا الطالب بالكامل من النظام؟' : 'Are you sure you want to delete this student from the database?')) {
                            const res = await deleteStudent(s.id);
                            if (res && !res.success) {
                              alert((locale === 'ar' ? 'فشل حذف الطالب من قاعدة البيانات: ' : 'Failed to delete student: ') + res.error);
                            }
                          }
                        }}
                        className="text-error hover:bg-error/10 px-3 py-1.5 font-bold transition-colors border-0 cursor-pointer text-xs animate-in"
                      >
                        {locale === 'ar' ? 'حذف الطالب' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredStudentsList.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-secondary font-bold">
                      {locale === 'ar' ? 'لا يوجد خريجون في هذا القسم.' : 'No graduates found in this section.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}



      {/* PANEL 3: Memories */}
      {activeTab === 'memories' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 w-full">
          {/* Add Form */}
          <div className="lg:col-span-1 bg-[#F5E6D3] dark:bg-surface-container p-6 border border-outline-variant/20 shadow-sm flex flex-col gap-6 w-full">
            <h3 className="text-base text-primary font-bold border-b border-primary/10 pb-3">
              {locale === 'ar' ? 'إضافة صورة أو فيديو ذكريات جديد' : 'Add New Gallery Memory'}
            </h3>

            <form onSubmit={handleAddMemory} className="flex flex-col gap-6">
              {memSuccess && (
                <div className="p-3 bg-[#efe0cd] border border-[#c59e62] text-primary font-bold text-xs">
                  {locale === 'ar' ? 'تمت إضافة الذكرى بنجاح!' : 'Memory added successfully!'}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-sm text-on-surface-variant font-bold block mb-1">
                  {locale === 'ar' ? 'نوع الوسائط' : 'Media Type'}
                </label>
                <select
                  value={memType}
                  onChange={(e) => setMemType(e.target.value)}
                  className="bg-surface-container border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-2 text-sm text-primary w-full cursor-pointer"
                >
                  <option value="image">{locale === 'ar' ? 'صورة' : 'Image'}</option>
                  <option value="video">{locale === 'ar' ? 'فيديو' : 'Video'}</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-on-surface-variant font-bold block mb-1">
                  {locale === 'ar' ? 'العنوان بالعربية' : 'Title (Arabic)'}
                </label>
                <input
                  type="text"
                  value={memTitleAr}
                  onChange={(e) => setMemTitleAr(e.target.value)}
                  className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-2 text-sm text-primary w-full"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-on-surface-variant font-bold block mb-1">
                  {locale === 'ar' ? 'العنوان بالإنجليزية' : 'Title (English)'}
                </label>
                <input
                  type="text"
                  value={memTitleEn}
                  onChange={(e) => setMemTitleEn(e.target.value)}
                  className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-2 text-sm text-primary w-full"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-on-surface-variant font-bold block mb-1">
                  {memType === 'image' 
                    ? (locale === 'ar' ? 'رابط الصورة الإلكتروني' : 'Image URL')
                    : (locale === 'ar' ? 'رابط الفيديو الإلكتروني (يوتيوب أو مباشر)' : 'Video URL (YouTube or Direct)')
                  }
                </label>
                <input
                  type="url"
                  value={memUrl}
                  onChange={(e) => setMemUrl(e.target.value)}
                  className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-2 text-sm text-primary w-full"
                  placeholder="https://..."
                  required
                />
              </div>

              {memType === 'video' && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-on-surface-variant font-bold block mb-1">
                    {locale === 'ar' ? 'رابط صورة الغلاف الخاص بالفيديو (اختياري)' : 'Video Cover Image URL (Optional)'}
                  </label>
                  <input
                    type="url"
                    value={memCoverUrl}
                    onChange={(e) => setMemCoverUrl(e.target.value)}
                    className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-2 text-sm text-primary w-full"
                    placeholder="https://..."
                  />
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-sm text-on-surface-variant font-bold block mb-1">
                  {locale === 'ar' ? 'التصنيف' : 'Category'}
                </label>
                <select
                  value={memCat}
                  onChange={(e) => setMemCat(e.target.value)}
                  className="bg-surface-container border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-2 text-sm text-primary w-full cursor-pointer"
                >
                  <option value="ceremony">{locale === 'ar' ? 'الحفل' : 'Ceremony'}</option>
                  <option value="projects">{locale === 'ar' ? 'مشاريع التخرج' : 'Graduation Projects'}</option>
                  <option value="trips">{locale === 'ar' ? 'الرحلات' : 'Trips'}</option>
                  <option value="campus">{locale === 'ar' ? 'الحياة الجامعية' : 'Campus Life'}</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-white text-sm py-3 hover:bg-primary/90 transition-all font-bold cursor-pointer border-0 disabled:opacity-50"
              >
                {isSubmitting ? (locale === 'ar' ? 'جاري الإضافة...' : 'Adding...') : (locale === 'ar' ? 'إضافة المعرض' : 'Add to Gallery')}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-[#F5E6D3] dark:bg-surface-container p-6 border border-outline-variant/20 shadow-sm overflow-x-auto w-full">
            <h3 className="text-base text-primary font-bold border-b border-primary/10 pb-3 mb-4">
              {locale === 'ar' ? 'الذكريات الحالية في المعرض' : 'Current Gallery Memories'}
            </h3>
            <table className="w-full text-right rtl:text-right ltr:text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-primary/20 font-bold text-secondary uppercase tracking-widest text-xs">
                  <th className="py-3 px-4">{locale === 'ar' ? 'النوع / معاينة' : 'Type / Preview'}</th>
                  <th className="py-3 px-4">{locale === 'ar' ? 'العنوان' : 'Title'}</th>
                  <th className="py-3 px-4">{locale === 'ar' ? 'التحكم' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {memories.map(m => (
                  <tr key={m.id} className="border-b border-primary/10 hover:bg-primary/5 font-semibold text-primary">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {m.media_type === 'video' ? (
                          <div className="w-12 h-8 bg-black flex items-center justify-center text-[#c59e62] border border-outline-variant/30">
                            <span className="material-symbols-outlined text-lg">play_circle</span>
                          </div>
                        ) : (
                          <img src={m.url} alt="" className="w-12 h-8 object-cover border border-outline-variant/30" />
                        )}
                        <span className="text-xs text-secondary capitalize">
                          {m.media_type === 'video' ? (locale === 'ar' ? 'فيديو' : 'video') : (locale === 'ar' ? 'صورة' : 'image')}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold">{m[`title_${locale}`]}</td>
                    <td className="py-3 px-4 flex gap-2">
                      <button
                        onClick={() => startEditingMemory(m)}
                        className="bg-primary text-[#c59e62] hover:bg-primary/95 text-[10px] font-bold px-3 py-1.5 border-0 cursor-pointer"
                      >
                        {locale === 'ar' ? 'تعديل' : 'Edit'}
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm(locale === 'ar' ? 'حذف هذه الذكرى؟' : 'Delete this memory?')) {
                            const res = await deleteMemory(m.id);
                            if (res && !res.success) {
                              alert((locale === 'ar' ? 'فشل حذف الذكرى من قاعدة البيانات: ' : 'Failed to delete memory: ') + res.error);
                            }
                          }
                        }}
                        className="text-error hover:bg-error/10 px-3 py-1.5 font-bold transition-colors border-0 cursor-pointer text-xs"
                      >
                        {locale === 'ar' ? 'حذف' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
                {memories.length === 0 && (
                  <tr>
                    <td colSpan="3" className="py-6 text-center text-secondary">
                      {locale === 'ar' ? 'لا توجد صور.' : 'No images found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PANEL 4: Sponsors */}
      {activeTab === 'sponsors' && (
        <div className="bg-[#F5E6D3] dark:bg-surface-container p-6 md:p-8 border border-outline-variant/20 shadow-sm w-full">
          <h3 className="text-lg text-primary font-bold border-b border-primary/10 pb-4 mb-6">
            {locale === 'ar' ? 'إدارة الداعمين والشركاء' : 'Manage Sponsors & Partners'}
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add Sponsor Form */}
            <div className="lg:col-span-1 bg-background border border-outline-variant/20 p-6 shadow-sm">
              <h4 className="text-sm font-bold text-primary border-b border-primary/10 pb-3 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c59e62] text-lg">add_business</span>
                {locale === 'ar' ? 'إضافة داعم جديد' : 'Add New Sponsor'}
              </h4>

              {spSuccess && (
                <div className="mb-4 p-3 bg-green-100 dark:bg-green-950/40 border border-green-500/20 text-green-700 dark:text-green-300 font-bold text-xs text-center">
                  {locale === 'ar' ? '✅ تمت إضافة الداعم بنجاح!' : '✅ Sponsor added successfully!'}
                </div>
              )}

              <form onSubmit={handleAddSponsor} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-secondary font-bold">
                    {locale === 'ar' ? 'اسم الداعم / الشركة *' : 'Sponsor / Company Name *'}
                  </label>
                  <input
                    type="text"
                    value={spName}
                    onChange={(e) => setSpName(e.target.value)}
                    required
                    placeholder={locale === 'ar' ? 'مثل: شركة الآفاق' : 'e.g. Horizons Company'}
                    className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-1.5 text-sm text-primary w-full"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-secondary font-bold">
                    {locale === 'ar' ? 'رابط الشعار (URL) *' : 'Logo URL *'}
                  </label>
                  <input
                    type="url"
                    value={spLogo}
                    onChange={(e) => setSpLogo(e.target.value)}
                    required
                    placeholder="https://example.com/logo.png"
                    className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-1.5 text-sm text-primary w-full"
                  />
                  {spLogo && (
                    <img src={spLogo} alt="preview" className="mt-2 h-12 w-auto object-contain border border-outline-variant/20 p-1" onError={(e) => e.target.style.display='none'} />
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-secondary font-bold">
                    {locale === 'ar' ? 'الوصف المختصر' : 'Short Description'}
                  </label>
                  <textarea
                    value={spDesc}
                    onChange={(e) => setSpDesc(e.target.value)}
                    rows="2"
                    placeholder={locale === 'ar' ? 'نبذة عن الداعم...' : 'Brief about the sponsor...'}
                    className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-1.5 text-sm text-primary resize-none w-full"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-secondary font-bold">
                    {locale === 'ar' ? 'الموقع الإلكتروني' : 'Website Link'}
                  </label>
                  <input
                    type="url"
                    value={spLink}
                    onChange={(e) => setSpLink(e.target.value)}
                    placeholder="https://example.com"
                    className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-1.5 text-sm text-primary w-full"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-secondary font-bold">
                    {locale === 'ar' ? 'مستوى الدعم' : 'Sponsorship Tier'}
                  </label>
                  <select
                    value={spTier}
                    onChange={(e) => setSpTier(e.target.value)}
                    className="bg-surface-container border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-2.5 px-2 text-xs text-on-surface cursor-pointer w-full"
                  >
                    <option value="platinum">{locale === 'ar' ? 'بلاتيني' : 'Platinum'}</option>
                    <option value="gold">{locale === 'ar' ? 'ذهبي' : 'Gold'}</option>
                    <option value="silver">{locale === 'ar' ? 'فضي' : 'Silver'}</option>
                    <option value="bronze">{locale === 'ar' ? 'برونزي' : 'Bronze'}</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingSponsor}
                  className="bg-primary text-white text-sm py-3 hover:bg-primary/90 transition-all font-bold cursor-pointer border-0 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmittingSponsor && <span className="material-symbols-outlined animate-spin text-base">refresh</span>}
                  {isSubmittingSponsor
                    ? (locale === 'ar' ? 'جار الحفظ...' : 'Saving...')
                    : (locale === 'ar' ? 'إضافة الداعم' : 'Add Sponsor')
                  }
                </button>
              </form>
            </div>

            {/* Sponsors List */}
            <div className="lg:col-span-2 bg-background border border-outline-variant/20 p-6 shadow-sm">
              <h4 className="text-sm font-bold text-primary border-b border-primary/10 pb-3 mb-4">
                {locale === 'ar' ? `الداعمون الحاليون (${sponsors.length})` : `Current Sponsors (${sponsors.length})`}
              </h4>

              {sponsors.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {sponsors.map(sp => (
                    <div key={sp.id} className="border border-outline-variant/20 p-4 flex gap-4 items-start hover:border-[#c59e62]/40 transition-colors">
                      <img
                        src={sp.logo_url}
                        alt={sp.name_ar}
                        className="w-16 h-16 object-contain shrink-0 border border-outline-variant/10 p-1"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/64?text=Logo'; }}
                      />
                      <div className="flex-grow min-w-0">
                        <p className="font-bold text-primary text-sm truncate">{sp.name_ar}</p>
                        {sp.description_ar && (
                          <p className="text-xs text-secondary mt-0.5 line-clamp-2">{sp.description_ar}</p>
                        )}
                        {sp.website_link && (
                          <a
                            href={sp.website_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-[#c59e62] hover:underline mt-1 block truncate"
                          >
                            {sp.website_link}
                          </a>
                        )}
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => startEditingSponsor(sp)}
                            className="text-primary text-[10px] font-bold hover:bg-[#c59e62]/10 px-2 py-1 border border-outline-variant/30 cursor-pointer bg-transparent"
                          >
                            {locale === 'ar' ? 'تعديل' : 'Edit'}
                          </button>
                          <button
                            onClick={async () => {
                              if (window.confirm(locale === 'ar' ? 'حذف هذا الداعم نهائياً؟' : 'Delete this sponsor permanently?')) {
                                await deleteSponsorItem(sp.id);
                              }
                            }}
                            className="text-error text-[10px] font-bold hover:bg-error/10 px-2 py-1 border-0 cursor-pointer bg-transparent"
                          >
                            {locale === 'ar' ? 'حذف' : 'Delete'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-secondary font-bold text-sm">
                  <span className="material-symbols-outlined text-4xl text-outline-variant block mb-2">business</span>
                  {locale === 'ar' ? 'لا يوجد داعمون حتى الآن.' : 'No sponsors added yet.'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Sponsor Modal */}
      {editingSponsor && (
        <div className="fixed inset-0 bg-black/65 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#F5E6D3] dark:bg-surface-container border border-[#c59e62]/20 p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-300">
            <button
              onClick={() => setEditingSponsor(null)}
              className="absolute top-4 right-4 text-primary hover:text-secondary bg-transparent border-0 cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <h2 className="text-xl font-bold text-primary mb-6 border-b border-[#c59e62]/20 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#c59e62]">edit</span>
              {locale === 'ar' ? 'تعديل بيانات الداعم' : 'Edit Sponsor'}
            </h2>

            {sponsorEditSuccess && (
              <div className="mb-4 p-3 bg-green-100 dark:bg-green-950/40 border border-green-500/20 text-green-700 font-bold text-xs text-center">
                {locale === 'ar' ? '✅ تم حفظ التغييرات بنجاح!' : '✅ Changes saved successfully!'}
              </div>
            )}
            {sponsorEditError && (
              <div className="mb-4 p-3 bg-error-container border border-error/20 text-error font-bold text-xs text-center">
                {sponsorEditError}
              </div>
            )}

            <form onSubmit={handleSaveSponsor} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-secondary font-bold">{locale === 'ar' ? 'اسم الداعم' : 'Sponsor Name'}</label>
                <input type="text" value={editSpName} onChange={e => setEditSpName(e.target.value)} required
                  className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-1.5 text-sm text-primary w-full" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-secondary font-bold">{locale === 'ar' ? 'رابط الشعار (URL)' : 'Logo URL'}</label>
                <input type="url" value={editSpLogo} onChange={e => setEditSpLogo(e.target.value)}
                  className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-1.5 text-sm text-primary w-full" />
                {editSpLogo && <img src={editSpLogo} alt="preview" className="mt-2 h-12 object-contain border border-outline-variant/20 p-1" onError={e => e.target.style.display='none'} />}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-secondary font-bold">{locale === 'ar' ? 'الوصف المختصر' : 'Short Description'}</label>
                <textarea value={editSpDesc} onChange={e => setEditSpDesc(e.target.value)} rows="2"
                  className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-1.5 text-sm text-primary resize-none w-full" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-secondary font-bold">{locale === 'ar' ? 'الموقع الإلكتروني' : 'Website Link'}</label>
                <input type="url" value={editSpLink} onChange={e => setEditSpLink(e.target.value)}
                  className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-1.5 text-sm text-primary w-full" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-secondary font-bold">{locale === 'ar' ? 'نوع الدعم (الفئة)' : 'Sponsorship Tier'}</label>
                <select
                  value={editSpTier}
                  onChange={(e) => setEditSpTier(e.target.value)}
                  className="bg-surface-container border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-2.5 px-3 text-xs text-on-surface cursor-pointer w-full"
                >
                  <option value="platinum">{locale === 'ar' ? '🏆 بلاتيني' : '🏆 Platinum'}</option>
                  <option value="gold">{locale === 'ar' ? '🥇 ذهبي' : '🥇 Gold'}</option>
                  <option value="silver">{locale === 'ar' ? '🥈 فضي' : '🥈 Silver'}</option>
                  <option value="bronze">{locale === 'ar' ? '🥉 برونزي' : '🥉 Bronze'}</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setEditingSponsor(null)}
                  className="px-4 py-2 border border-outline-variant/30 text-secondary text-xs font-bold hover:bg-black/5 bg-transparent">
                  {locale === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button type="submit" disabled={isSavingSponsor}
                  className="px-6 py-2 bg-[#c59e62] text-primary hover:bg-[#ffdeae] text-xs font-bold flex items-center gap-1.5 border-0">
                  {isSavingSponsor && <span className="material-symbols-outlined animate-spin text-[14px]">refresh</span>}
                  {locale === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PANEL 5: Doctors */}
      {activeTab === 'doctors' && (
        <div className="bg-[#F5E6D3] dark:bg-surface-container p-6 md:p-8 border border-outline-variant/20 shadow-sm w-full">
          <h3 className="text-lg text-primary font-bold border-b border-primary/10 pb-4 mb-6">
            {locale === 'ar' ? 'إدارة كلمات أعضاء التدريس والدكاترة' : 'Manage Faculty Words & Speeches'}
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add Doctor Form */}
            <div className="lg:col-span-1 bg-background border border-outline-variant/20 p-6 shadow-sm">
              <h4 className="text-sm font-bold text-primary border-b border-primary/10 pb-3 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c59e62] text-lg">add_circle</span>
                {locale === 'ar' ? 'إضافة كلمة دكتور جديدة' : 'Add New Doctor Speech'}
              </h4>

              {docSuccess && (
                <div className="mb-4 p-3 bg-[#efe0cd] border border-[#c59e62] text-primary font-bold text-xs text-center">
                  {locale === 'ar' ? '✅ تمت الإضافة بنجاح!' : '✅ Added successfully!'}
                </div>
              )}

              <form onSubmit={handleAddDoctor} className="flex flex-col gap-4 text-right rtl:text-right ltr:text-left">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-secondary font-bold">
                    {locale === 'ar' ? 'اسم الدكتور / الأستاذ *' : 'Doctor Name *'}
                  </label>
                  <input
                    type="text"
                    value={docNameAr}
                    onChange={(e) => setDocNameAr(e.target.value)}
                    required
                    placeholder={locale === 'ar' ? 'د. أحمد علي' : 'Dr. Ahmed Ali'}
                    className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-1.5 text-sm text-primary w-full"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-secondary font-bold">
                    {locale === 'ar' ? 'المسمى الوظيفي / القسم *' : 'Title / Dept *'}
                  </label>
                  <input
                    type="text"
                    value={docTitleAr}
                    onChange={(e) => setDocTitleAr(e.target.value)}
                    required
                    placeholder={locale === 'ar' ? 'رئيس قسم الهندسة المعمارية' : 'Head of Architecture Dept'}
                    className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-1.5 text-sm text-primary w-full"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-secondary font-bold">
                    {locale === 'ar' ? 'نص الكلمة / التهنئة *' : 'Speech Text *'}
                  </label>
                  <textarea
                    value={docSpeechAr}
                    onChange={(e) => setDocSpeechAr(e.target.value)}
                    required
                    rows="4"
                    placeholder={locale === 'ar' ? 'اكتب الرسالة الموجهة للطلاب...' : 'Write the message...'}
                    className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-1.5 text-sm text-primary resize-none w-full leading-relaxed"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-secondary font-bold">{locale === 'ar' ? 'صورة الدكتور' : 'Doctor Photo'}</label>
                  <div className="flex gap-4 mb-1 text-[10px]">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input type="radio" checked={docImageInputType === 'url'} onChange={() => setDocImageInputType('url')} name="docImageInputType" className="accent-[#c59e62]" />
                      {locale === 'ar' ? 'رابط (URL)' : 'Paste URL'}
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input type="radio" checked={docImageInputType === 'file'} onChange={() => setDocImageInputType('file')} name="docImageInputType" className="accent-[#c59e62]" />
                      {locale === 'ar' ? 'تحميل ملف' : 'Upload File'}
                    </label>
                  </div>

                  {docImageInputType === 'url' ? (
                    <input 
                      type="url" 
                      value={docImageUrl}
                      onChange={(e) => setDocImageUrl(e.target.value)}
                      className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-1 text-xs text-primary w-full"
                      placeholder="https://example.com/logo.jpg"
                    />
                  ) : (
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setDocImageFile(e.target.files[0])}
                      className="text-[10px] text-primary file:bg-primary file:text-white file:border-0 file:py-1 file:px-2 file:cursor-pointer hover:file:opacity-90 w-full"
                    />
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingDoctor}
                  className="bg-primary text-white text-xs py-3 mt-2 hover:bg-primary/90 transition-all font-bold cursor-pointer border-0 disabled:opacity-50"
                >
                  {isSubmittingDoctor ? (locale === 'ar' ? 'جاري الإضافة...' : 'Adding...') : (locale === 'ar' ? 'إضافة ونشر الكلمة' : 'Add Speech')}
                </button>
              </form>
            </div>

            {/* List Doctors */}
            <div className="lg:col-span-2 bg-background border border-outline-variant/20 p-6 shadow-sm overflow-x-auto w-full">
              <h4 className="text-sm font-bold text-primary border-b border-primary/10 pb-3 mb-4">
                {locale === 'ar' ? 'قائمة الدكاترة والكلمات المنشورة' : 'Published Doctor Speeches'}
              </h4>
              <table className="w-full text-right rtl:text-right ltr:text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-primary/20 font-bold text-secondary uppercase tracking-widest text-[10px]">
                    <th className="py-2.5 px-3">{locale === 'ar' ? 'الصورة' : 'Avatar'}</th>
                    <th className="py-2.5 px-3">{locale === 'ar' ? 'الاسم' : 'Name'}</th>
                    <th className="py-2.5 px-3">{locale === 'ar' ? 'المنصب' : 'Title'}</th>
                    <th className="py-2.5 px-3">{locale === 'ar' ? 'التحكم' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map(d => (
                    <tr key={d.id} className="border-b border-primary/10 hover:bg-primary/5 font-semibold text-primary">
                      <td className="py-2.5 px-3">
                        <img 
                          src={d.image_url || 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(d.name_ar)} 
                          alt="" 
                          className="w-8 h-8 rounded-full object-cover border border-outline-variant/30" 
                        />
                      </td>
                      <td className="py-2.5 px-3 font-bold">{d.name_ar}</td>
                      <td className="py-2.5 px-3 text-secondary">{d.title_ar}</td>
                      <td className="py-2.5 px-3 flex gap-2">
                        <button
                          onClick={() => startEditingDoctor(d)}
                          className="bg-[#efe0cd] text-primary hover:bg-[#c59e62]/20 text-[9px] font-bold px-2 py-1 border-0 rounded cursor-pointer"
                        >
                          {locale === 'ar' ? 'تعديل الصورة' : 'Edit Image'}
                        </button>
                        <button
                          onClick={async () => {
                            if (window.confirm(locale === 'ar' ? `هل أنت متأكد من حذف كلمة ${d.name_ar}؟` : `Delete speech by ${d.name_ar}?`)) {
                              const res = await deleteDoctor(d.id);
                              if (res && !res.success) {
                                alert((locale === 'ar' ? 'فشل الحذف: ' : 'Delete failed: ') + res.error);
                              }
                            }
                          }}
                          className="text-error hover:bg-error/10 px-2 py-1 font-bold transition-colors border-0 cursor-pointer text-[9px]"
                        >
                          {locale === 'ar' ? 'حذف' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {doctors.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-6 text-center text-secondary">
                        {locale === 'ar' ? 'لا يوجد دكاترة مسجلين في قاعدة البيانات. (يتم استخدام البيانات الثابتة في العرض كبديل مؤقت).' : 'No doctors in database. Fallbacks are shown in public view.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Edit Doctor Image Modal */}
      {editingDoctor && (
        <div className="fixed inset-0 bg-black/65 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#F5E6D3] dark:bg-surface-container border border-[#c59e62]/20 p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-300">
            <button 
              onClick={() => setEditingDoctor(null)}
              className="absolute top-4 right-4 text-primary hover:text-secondary bg-transparent border-0 cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            
            <h2 className="text-xl font-bold text-primary mb-6 border-b border-[#c59e62]/20 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#c59e62]">image</span>
              {locale === 'ar' ? `تعديل صورة ${editingDoctor.name_ar}` : `Edit Photo for ${editingDoctor.name_ar}`}
            </h2>
            
            {doctorImageEditSuccess && (
              <div className="mb-4 p-3 bg-green-100 dark:bg-green-950/40 border border-green-500/20 text-green-700 dark:text-green-300 font-bold text-xs text-center">
                {locale === 'ar' ? '✅ تم حفظ الصورة بنجاح!' : '✅ Image updated successfully!'}
              </div>
            )}

            {doctorImageEditError && (
              <div className="mb-4 p-3 bg-error-container border border-error/20 text-error font-bold text-xs text-center">
                {doctorImageEditError}
              </div>
            )}

            <form onSubmit={handleSaveDoctorImage} className="space-y-4 text-right rtl:text-right ltr:text-left">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-secondary font-bold">{locale === 'ar' ? 'طريقة تحديث الصورة' : 'Image Update Method'}</label>
                <div className="flex gap-4 mb-2 text-xs">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="radio" checked={editDocImageInputType === 'url'} onChange={() => setEditDocImageInputType('url')} name="editDocImageInputType" className="accent-[#c59e62]" />
                    {locale === 'ar' ? 'رابط إلكتروني (URL)' : 'Paste URL'}
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="radio" checked={editDocImageInputType === 'file'} onChange={() => setEditDocImageInputType('file')} name="editDocImageInputType" className="accent-[#c59e62]" />
                    {locale === 'ar' ? 'تحميل ملف جديد' : 'Upload File'}
                  </label>
                </div>

                {editDocImageInputType === 'url' ? (
                  <input 
                    type="url" 
                    value={editDocImageUrl}
                    onChange={(e) => setEditDocImageUrl(e.target.value)}
                    className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-1.5 text-sm text-primary w-full"
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                ) : (
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setEditDocImageFile(e.target.files[0])}
                    className="text-xs text-primary file:bg-primary file:text-white file:border-0 file:py-1.5 file:px-3 file:cursor-pointer hover:file:opacity-90 w-full"
                    required={!editDocImageFile}
                  />
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setEditingDoctor(null)}
                  className="px-4 py-2 border border-outline-variant/30 text-secondary text-xs font-bold hover:bg-black/5 bg-transparent cursor-pointer"
                >
                  {locale === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button 
                  type="submit"
                  disabled={isSavingDoctorImage}
                  className="px-6 py-2 bg-[#c59e62] text-primary hover:bg-[#ffdeae] text-xs font-bold flex items-center gap-1.5 border-0 cursor-pointer"
                >
                  {isSavingDoctorImage && <span className="material-symbols-outlined animate-spin text-[14px]">refresh</span>}
                  {locale === 'ar' ? 'حفظ الصورة' : 'Save Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black/65 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#F5E6D3] dark:bg-surface-container border border-[#c59e62]/20 p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-300">
            <button 
              onClick={() => setEditingStudent(null)}
              className="absolute top-4 right-4 text-primary hover:text-secondary bg-transparent border-0 cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            
            <h2 className="text-xl font-bold text-primary mb-6 border-b border-[#c59e62]/20 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined">manage_accounts</span>
              {locale === 'ar' ? 'تعديل بيانات الطالب' : 'Edit Student Profile'}
            </h2>
            
            {studentEditSuccess && (
              <div className="mb-4 p-3 bg-green-100 dark:bg-green-950/40 border border-green-500/20 text-green-700 dark:text-green-300 font-bold text-xs text-center">
                {locale === 'ar' ? '✅ تم حفظ التغييرات بنجاح!' : '✅ Changes saved successfully!'}
              </div>
            )}

            {studentEditError && (
              <div className="mb-4 p-3 bg-error-container border border-error/20 text-error font-bold text-xs text-center">
                {studentEditError}
              </div>
            )}

            <form onSubmit={handleSaveStudent} className="space-y-4">
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
                <label className="text-xs text-secondary font-bold">{locale === 'ar' ? 'التخصص الأكاديمي' : 'Major Department'}</label>
                <select
                  value={editMajor}
                  onChange={(e) => setEditMajor(e.target.value)}
                  className="bg-surface-container border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-2.5 px-3 text-xs text-on-surface cursor-pointer w-full"
                >
                  <option value="it">{locale === 'ar' ? 'تقنية معلومات' : 'Information Technology'}</option>
                  <option value="arch">{locale === 'ar' ? 'هندسة معمارية' : 'Architecture'}</option>
                  <option value="acc">{locale === 'ar' ? 'محاسبة' : 'Accounting'}</option>
                </select>
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
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 border border-outline-variant/30 text-secondary text-xs font-bold hover:bg-black/5 bg-transparent"
                >
                  {locale === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button 
                  type="submit"
                  disabled={isSavingStudent}
                  className="px-6 py-2 bg-[#c59e62] text-primary hover:bg-[#ffdeae] text-xs font-bold flex items-center gap-1.5 border-0"
                >
                  {isSavingStudent && <span className="material-symbols-outlined animate-spin text-[14px]">refresh</span>}
                  {locale === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Memory Modal */}
      {editingMemory && (
        <div className="fixed inset-0 bg-black/65 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#F5E6D3] dark:bg-surface-container border border-[#c59e62]/20 p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-300">
            <button 
              onClick={() => setEditingMemory(null)}
              className="absolute top-4 right-4 text-primary hover:text-secondary bg-transparent border-0 cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            
            <h2 className="text-xl font-bold text-primary mb-6 border-b border-[#c59e62]/20 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#c59e62]">edit</span>
              {locale === 'ar' ? 'تعديل الذكرى' : 'Edit Memory'}
            </h2>
            
            {memoryEditSuccess && (
              <div className="mb-4 p-3 bg-green-100 dark:bg-green-950/40 border border-green-500/20 text-green-700 dark:text-green-300 font-bold text-xs text-center">
                {locale === 'ar' ? '✅ تم حفظ التغييرات بنجاح!' : '✅ Changes saved successfully!'}
              </div>
            )}

            {memoryEditError && (
              <div className="mb-4 p-3 bg-error-container border border-error/20 text-error font-bold text-xs text-center">
                {memoryEditError}
              </div>
            )}

            <form onSubmit={handleSaveMemory} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-secondary font-bold">
                  {locale === 'ar' ? 'نوع الوسائط' : 'Media Type'}
                </label>
                <select
                  value={editMemType}
                  onChange={(e) => setEditMemType(e.target.value)}
                  className="bg-surface-container border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-2.5 px-3 text-xs text-on-surface cursor-pointer w-full"
                >
                  <option value="image">{locale === 'ar' ? 'صورة' : 'Image'}</option>
                  <option value="video">{locale === 'ar' ? 'فيديو' : 'Video'}</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-secondary font-bold">{locale === 'ar' ? 'العنوان بالعربية' : 'Title (Arabic)'}</label>
                <input 
                  type="text" 
                  value={editMemTitleAr}
                  onChange={(e) => setEditMemTitleAr(e.target.value)}
                  className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-1.5 text-sm text-primary w-full"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-secondary font-bold">{locale === 'ar' ? 'العنوان بالإنجليزية' : 'Title (English)'}</label>
                <input 
                  type="text" 
                  value={editMemTitleEn}
                  onChange={(e) => setEditMemTitleEn(e.target.value)}
                  className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-1.5 text-sm text-primary w-full"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-secondary font-bold">
                  {editMemType === 'image' 
                    ? (locale === 'ar' ? 'رابط الصورة الإلكتروني' : 'Image URL')
                    : (locale === 'ar' ? 'رابط الفيديو الإلكتروني' : 'Video URL')
                  }
                </label>
                <input 
                  type="url" 
                  value={editMemUrl}
                  onChange={(e) => setEditMemUrl(e.target.value)}
                  className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-1.5 text-sm text-primary w-full"
                  required
                />
              </div>

              {editMemType === 'video' && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-secondary font-bold">
                    {locale === 'ar' ? 'رابط صورة الغلاف الخاص بالفيديو (اختياري)' : 'Video Cover Image URL (Optional)'}
                  </label>
                  <input 
                    type="url" 
                    value={editMemCoverUrl}
                    onChange={(e) => setEditMemCoverUrl(e.target.value)}
                    className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-1.5 text-sm text-primary w-full"
                    placeholder="https://..."
                  />
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-xs text-secondary font-bold">{locale === 'ar' ? 'التصنيف' : 'Category'}</label>
                <select
                  value={editMemCat}
                  onChange={(e) => setEditMemCat(e.target.value)}
                  className="bg-surface-container border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-2.5 px-3 text-xs text-on-surface cursor-pointer w-full"
                >
                  <option value="ceremony">{locale === 'ar' ? 'الحفل' : 'Ceremony'}</option>
                  <option value="projects">{locale === 'ar' ? 'مشاريع التخرج' : 'Graduation Projects'}</option>
                  <option value="trips">{locale === 'ar' ? 'الرحلات' : 'Trips'}</option>
                  <option value="campus">{locale === 'ar' ? 'الحياة الجامعية' : 'Campus Life'}</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setEditingMemory(null)}
                  className="px-4 py-2 border border-outline-variant/30 text-secondary text-xs font-bold hover:bg-black/5 bg-transparent"
                >
                  {locale === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button 
                  type="submit"
                  disabled={isSavingMemory}
                  className="px-6 py-2 bg-[#c59e62] text-primary hover:bg-[#ffdeae] text-xs font-bold flex items-center gap-1.5 border-0"
                >
                  {isSavingMemory && <span className="material-symbols-outlined animate-spin text-[14px]">refresh</span>}
                  {locale === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
