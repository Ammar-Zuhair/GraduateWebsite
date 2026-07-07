import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import SuccessAnimation from '../components/ui/SuccessAnimation';

export default function SendWishPage({ setActivePage }) {
  const { t, locale } = useLanguage();
  const { students, addWish } = useData();

  const [step, setStep] = useState(1);
  const [major, setMajor] = useState(null); // 'arch' or 'it'
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [message, setMessage] = useState('');
  const [author, setAuthor] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredStudents = students.filter(s => s.major === major && (s.status === 'approved' || (s.status === undefined && s.is_approved !== false)));
  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const handleSend = async () => {
    if (!message || (!isAnonymous && !author)) return;
    
    setIsSubmitting(true);
    const result = await addWish({
      studentId: selectedStudentId,
      author: author,
      relation: locale === 'ar' ? 'صديق' : 'Friend',
      message: message,
      anonymous: isAnonymous
    });

    setIsSubmitting(false);
    if (result.success) {
      setShowSuccess(true);
    } else {
      alert("Error sending wish. Please try again.");
    }
  };

  const handleSuccessComplete = () => {
    setActivePage('students');
  };

  if (showSuccess) {
    return (
      <div className="w-full max-w-container-max px-4 py-24 flex items-center justify-center min-h-[60vh]">
        <SuccessAnimation onComplete={handleSuccessComplete} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-container-max px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-display-lg text-primary mb-4 font-bold">{locale === 'ar' ? 'إرسال تهنئة' : 'Send a Wish'}</h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          {locale === 'ar' 
            ? 'شارك الخريجين فرحتهم بكلمات تبقى ذكرى خالدة.' 
            : 'Share the joy with our graduates with words that remain eternal.'}
        </p>
      </div>

      <div className="max-w-3xl mx-auto bg-surface-container-high p-8 shadow-sm border border-outline-variant/20 relative min-h-[400px]">
        {/* Step 1: Choose Major */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-headline-sm font-bold text-primary mb-6 text-center">
              {locale === 'ar' ? '1. اختر التخصص' : '1. Choose Major'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button 
                onClick={() => { setMajor('arch'); setStep(2); }}
                className="flex flex-col items-center p-8 bg-surface border border-outline-variant/30 hover:border-[#c59e62] hover:bg-[#c59e62]/5 transition-all group"
              >
                <span className="material-symbols-outlined text-6xl text-primary group-hover:text-[#c59e62] mb-4 transition-colors">architecture</span>
                <span className="text-lg font-bold text-primary">{locale === 'ar' ? 'هندسة معمارية' : 'Architecture'}</span>
              </button>
              <button 
                onClick={() => { setMajor('it'); setStep(2); }}
                className="flex flex-col items-center p-8 bg-surface border border-outline-variant/30 hover:border-[#c59e62] hover:bg-[#c59e62]/5 transition-all group"
              >
                <span className="material-symbols-outlined text-6xl text-primary group-hover:text-[#c59e62] mb-4 transition-colors">computer</span>
                <span className="text-lg font-bold text-primary">{locale === 'ar' ? 'تقنية معلومات' : 'Information Technology'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Choose Student */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <button onClick={() => setStep(1)} className="text-sm text-secondary hover:text-primary mb-6 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">{locale === 'ar' ? 'arrow_forward' : 'arrow_back'}</span>
              {locale === 'ar' ? 'الرجوع للتخصصات' : 'Back to Majors'}
            </button>
            <h2 className="text-headline-sm font-bold text-primary mb-6 text-center">
              {locale === 'ar' ? '2. اختر الطالب' : '2. Choose Student'}
            </h2>
            
            {filteredStudents.length === 0 ? (
              <p className="text-center text-on-surface-variant py-8">{locale === 'ar' ? 'لا يوجد طلاب في هذا التخصص حالياً.' : 'No students found in this major.'}</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto p-2">
                {filteredStudents.map(student => (
                  <div 
                    key={student.id} 
                    onClick={() => { setSelectedStudentId(student.id); setStep(3); }}
                    className="cursor-pointer flex flex-col items-center p-4 bg-surface border border-outline-variant/30 hover:border-[#c59e62] hover:shadow-md transition-all text-center"
                  >
                    <img src={student.profile_image} alt={student[`name_${locale}`]} className="w-16 h-16 rounded-full object-cover mb-3" />
                    <span className="font-bold text-sm text-primary">{student[`name_${locale}`]}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Write Message & Submit */}
        {step === 3 && selectedStudent && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <button onClick={() => setStep(2)} className="text-sm text-secondary hover:text-primary mb-6 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">{locale === 'ar' ? 'arrow_forward' : 'arrow_back'}</span>
              {locale === 'ar' ? 'الرجوع لاختيار الطالب' : 'Back to Students'}
            </button>
            
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-outline-variant/20">
              <img src={selectedStudent.profile_image} alt={selectedStudent[`name_${locale}`]} className="w-16 h-16 rounded-full object-cover" />
              <div>
                <h3 className="text-lg font-bold text-primary">{locale === 'ar' ? 'إرسال تهنئة إلى:' : 'Send wish to:'}</h3>
                <p className="text-secondary">{selectedStudent[`name_${locale}`]}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-primary mb-2">{locale === 'ar' ? 'الرسالة' : 'Message'}</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-4 bg-surface border border-outline-variant focus:border-[#c59e62] focus:ring-1 focus:ring-[#c59e62] outline-none transition-all h-32 resize-none"
                  placeholder={locale === 'ar' ? 'اكتب تهنئتك هنا...' : 'Write your congratulation here...'}
                />
              </div>

              {!isAnonymous && (
                <div className="animate-in fade-in">
                  <label className="block text-sm font-bold text-primary mb-2">{locale === 'ar' ? 'اسمك' : 'Your Name'}</label>
                  <input 
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full p-3 bg-surface border border-outline-variant focus:border-[#c59e62] outline-none transition-all"
                    placeholder={locale === 'ar' ? 'أحمد علي' : 'Ahmed Ali'}
                  />
                </div>
              )}

              <div className="flex items-center gap-3">
                <input 
                  type="checkbox"
                  id="anonymous-check"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-5 h-5 accent-[#c59e62] cursor-pointer"
                />
                <label htmlFor="anonymous-check" className="text-sm text-primary cursor-pointer select-none">
                  {locale === 'ar' ? 'إرسال كـ "مجهول" (إخفاء الاسم)' : 'Send anonymously (Hide name)'}
                </label>
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  onClick={handleSend}
                  disabled={isSubmitting || !message || (!isAnonymous && !author)}
                  className="bg-[#c59e62] text-primary font-bold px-8 py-3 hover:bg-[#ffdeae] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="material-symbols-outlined animate-spin">refresh</span>
                  ) : (
                    <span className="material-symbols-outlined">send</span>
                  )}
                  {locale === 'ar' ? 'إرسال التهنئة' : 'Send Wish'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
