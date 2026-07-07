import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

// Native Canvas Confetti Component
function ConfettiCanvas({ active }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#4E342E', '#F5E6D3', '#C8A165', '#ba1a1a', '#ffd700'];
    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * canvas.height,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 5,
      tiltAngleIncremental: Math.random() * 0.07 + 0.02,
      tiltAngle: 0
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, idx) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(p.tiltAngle);
        p.tilt = Math.sin(p.tiltAngle - idx / 3) * 15;

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.r + p.tilt / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();

        // Wrap around bottom
        if (p.y > canvas.height) {
          particles[idx] = {
            ...p,
            x: Math.random() * canvas.width,
            y: -20,
            tilt: Math.random() * 10 - 5
          };
        }
      });
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[150] w-full h-full"
    />
  );
}

export default function CongratulationsPage() {
  const { t, locale } = useLanguage();
  const { students, addWish } = useData();
  const { user, login, registerUser } = useAuth();

  // Auth screen state
  const [authTab, setAuthTab] = useState('login'); // login or signup
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');

  // Wish multi-step states
  const [step, setStep] = useState(1); // 1: Dept, 2: Student, 3: Message, 4: Success
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [triggerConfetti, setTriggerConfetti] = useState(false);

  // Form error
  const [formError, setFormError] = useState('');

  // Reset steps
  const resetForm = () => {
    setStep(1);
    setSelectedDept('');
    setSelectedStudentId('');
    setMessage('');
    setAnonymous(false);
    setTriggerConfetti(false);
    setFormError('');
  };

  // Auth Handlers
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthError('');

    if (!authEmail || !authPassword) {
      setAuthError(locale === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة.' : 'Please fill out all required fields.');
      return;
    }

    if (authTab === 'login') {
      const res = login(authEmail, authPassword, students);
      if (!res.success) {
        setAuthError(locale === 'ar' ? 'فشل تسجيل الدخول. يرجى التحقق من بياناتك.' : 'Login failed. Please check your credentials.');
      }
    } else {
      if (!authName) {
        setAuthError(locale === 'ar' ? 'يرجى إدخال اسمك الكامل.' : 'Please enter your full name.');
        return;
      }
      registerUser(authEmail, authName, authPassword);
    }
  };

  // Multi-step handlers
  const handleNextStep = () => {
    setFormError('');
    if (step === 1) {
      if (!selectedDept) {
        setFormError(locale === 'ar' ? 'يرجى اختيار القسم أولاً.' : 'Please select a major department.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!selectedStudentId) {
        setFormError(locale === 'ar' ? 'يرجى اختيار طالب تود تهنئته.' : 'Please select a graduate to congratulate.');
        return;
      }
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setFormError('');
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleWishSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!message.trim()) {
      setFormError(locale === 'ar' ? 'يرجى كتابة رسالة التهنئة الخاصة بك.' : 'Please write your congratulations message.');
      return;
    }

    // Call addWish from context
    addWish({
      studentId: selectedStudentId,
      author: user?.name || 'زائر',
      relation: user?.role === 'student' ? 'زميل متخرج' : 'مهنئ',
      message: message,
      anonymous: anonymous
    });

    setTriggerConfetti(true);
    setStep(4);
  };

  // Filter students based on chosen department
  const filteredStudents = students.filter(s => s.dept === selectedDept);

  // Return Auth screen if guest
  if (!user) {
    return (
      <main className="flex-grow flex flex-col items-center justify-center w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-24">
        <div className="w-full max-w-md bg-[#F5E6D3] dark:bg-surface-container p-8 border border-[#c59e62]/20 shadow-md">
          {/* Tabs */}
          <div className="flex border-b border-primary/10 mb-8 select-none">
            <button
              onClick={() => { setAuthTab('login'); setAuthError(''); }}
              className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                authTab === 'login' 
                  ? 'border-b-2 border-[#c59e62] text-primary font-extrabold' 
                  : 'text-secondary hover:text-primary'
              }`}
            >
              {locale === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
            </button>
            <button
              onClick={() => { setAuthTab('signup'); setAuthError(''); }}
              className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                authTab === 'signup' 
                  ? 'border-b-2 border-[#c59e62] text-primary font-extrabold' 
                  : 'text-secondary hover:text-primary'
              }`}
            >
              {locale === 'ar' ? 'إنشاء حساب جديد' : 'Sign Up'}
            </button>
          </div>

          <h2 className="font-headline-sm text-lg text-primary mb-6 text-center font-bold">
            {authTab === 'login' 
              ? (locale === 'ar' ? 'مرحباً بك في بوابة الخريجين' : 'Welcome to Graduates Portal')
              : (locale === 'ar' ? 'انضم كعضو مهنئ' : 'Register as a Supporter')}
          </h2>

          <form onSubmit={handleAuthSubmit} className="flex flex-col gap-6">
            {authError && (
              <p className="text-xs text-error font-bold bg-error-container p-3 border border-error/20">
                {authError}
              </p>
            )}

            {authTab === 'signup' && (
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-xs text-on-surface-variant font-bold block mb-1">
                  {locale === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                </label>
                <input
                  type="text"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  className="bg-transparent border-0 border-b-2 border-primary-container focus:ring-0 focus:border-on-tertiary-container py-2 font-body-md text-sm text-primary placeholder-outline/50"
                  placeholder={locale === 'ar' ? 'أدخل اسمك هنا' : 'Enter your name'}
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="font-label-md text-xs text-on-surface-variant font-bold block mb-1">
                {locale === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <input
                type="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="bg-transparent border-0 border-b-2 border-primary-container focus:ring-0 focus:border-on-tertiary-container py-2 font-body-md text-sm text-primary placeholder-outline/50"
                placeholder="example@university.edu"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label-md text-xs text-on-surface-variant font-bold block mb-1">
                {locale === 'ar' ? 'كلمة المرور' : 'Password'}
              </label>
              <input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="bg-transparent border-0 border-b-2 border-primary-container focus:ring-0 focus:border-on-tertiary-container py-2 font-body-md text-sm text-primary placeholder-outline/50"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="bg-primary text-white font-label-md text-sm py-4 mt-4 hover:bg-primary-container transition-all font-bold uppercase cursor-pointer select-none rounded-none border-0"
            >
              {authTab === 'login' ? (locale === 'ar' ? 'تسجيل الدخول' : 'Sign In') : (locale === 'ar' ? 'إنشاء حسابي' : 'Sign Up')}
            </button>
          </form>

          {/* Info note */}
          <div className="mt-8 text-center text-[10px] text-secondary/60 leading-normal font-semibold">
            {locale === 'ar' 
              ? '* حسابات الطلاب يتم تفعيلها حصراً برابط الدعوة السري الخاص باللجنة.' 
              : '* Student accounts can only be activated via the private invitation link.'}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow flex flex-col items-center w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-24">
      {/* Confetti Overlay */}
      <ConfettiCanvas active={triggerConfetti} />

      <div className="w-full max-w-2xl bg-[#F5E6D3] dark:bg-surface-container p-8 md:p-12 border border-[#c59e62]/20 shadow-md">
        <h2 className="font-headline-sm text-headline-sm text-primary mb-2 text-center font-bold">
          {locale === 'ar' ? 'إرسال تهنئة تخرج' : 'Send Graduation Wish'}
        </h2>
        <p className="font-body-md text-xs text-secondary text-center mb-8 font-semibold">
          {locale === 'ar' ? 'عبر عن فخرك وشارك الخريجين فرحتهم بإرسال تهنئة مخصصة.' : 'Share your pride and celebrate the graduates by sending a dedicated message.'}
        </p>

        {formError && (
          <div className="mb-6 p-3 bg-error-container border border-error/20 text-error font-bold text-xs">
            {formError}
          </div>
        )}

        {/* STEP 1: Select Major */}
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <label className="font-label-md text-xs text-on-surface-variant font-bold block mb-1">
              {locale === 'ar' ? 'الخطوة 1: اختر تخصص الخريج' : 'Step 1: Select Graduate Major'}
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-surface-container border-0 border-b-2 border-primary focus:border-on-tertiary-container focus:ring-0 py-3.5 px-4 font-body-md text-on-surface cursor-pointer"
            >
              <option value="">{locale === 'ar' ? '-- اختر القسم الأكاديمي --' : '-- Choose Academic major --'}</option>
              <option value="arts">{t('filter_dept_arts')}</option>
              <option value="science">{t('filter_dept_science')}</option>
              <option value="engineering">{t('filter_dept_engineering')}</option>
            </select>
            
            <div className="flex justify-end mt-4">
              <button
                onClick={handleNextStep}
                className="bg-primary text-white font-label-md text-xs px-8 py-3.5 hover:bg-primary-container transition-all font-bold cursor-pointer border-0"
              >
                {locale === 'ar' ? 'التالي' : 'Next'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Select Student */}
        {step === 2 && (
          <div className="flex flex-col gap-6">
            <label className="font-label-md text-xs text-on-surface-variant font-bold block mb-1">
              {locale === 'ar' ? 'الخطوة 2: اختر الطالب المتخرج' : 'Step 2: Choose the Graduate Student'}
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full bg-surface-container border-0 border-b-2 border-primary focus:border-on-tertiary-container focus:ring-0 py-3.5 px-4 font-body-md text-on-surface cursor-pointer"
            >
              <option value="">{locale === 'ar' ? '-- اختر اسماً من القائمة --' : '-- Choose a student from list --'}</option>
              {filteredStudents.map(s => (
                <option key={s.id} value={s.id}>{s.name[locale]}</option>
              ))}
            </select>

            <div className="flex justify-between mt-4">
              <button
                onClick={handlePrevStep}
                className="border border-outline-variant/30 text-primary font-label-md text-xs px-8 py-3.5 hover:bg-primary/5 transition-all font-bold cursor-pointer"
              >
                {locale === 'ar' ? 'السابق' : 'Back'}
              </button>
              <button
                onClick={handleNextStep}
                className="bg-primary text-white font-label-md text-xs px-8 py-3.5 hover:bg-primary-container transition-all font-bold cursor-pointer border-0"
              >
                {locale === 'ar' ? 'التالي' : 'Next'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Message & Anonymous */}
        {step === 3 && (
          <form onSubmit={handleWishSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-xs text-on-surface-variant font-bold block mb-1" htmlFor="message">
                {locale === 'ar' ? 'الخطوة 3: اكتب رسالة التهنئة' : 'Step 3: Write Congratulations Message'}
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="4"
                className="bg-transparent border-0 border-b-2 border-primary-container focus:ring-0 focus:border-on-tertiary-container px-0 py-2 font-body-md text-sm text-primary placeholder-outline/50 resize-none"
                placeholder={locale === 'ar' ? 'اكتب تمنياتك الطيبة ودعواتك الصادقة للخريج...' : 'Write your kind wishes and sincere prayers...'}
              ></textarea>
            </div>

            {/* Anonymous switch */}
            <div className="flex items-center gap-3 select-none">
              <input
                type="checkbox"
                id="anonymous"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="w-4 h-4 text-primary bg-transparent border-primary-container focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <label htmlFor="anonymous" className="font-body-md text-xs text-on-surface-variant font-bold cursor-pointer">
                {locale === 'ar' ? 'إرسال الرسالة كرسالة مجهولة الاسم (من مجهول)' : 'Send message anonymously (From Anonymous)'}
              </label>
            </div>

            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={handlePrevStep}
                className="border border-outline-variant/30 text-primary font-label-md text-xs px-8 py-3.5 hover:bg-primary/5 transition-all font-bold cursor-pointer"
              >
                {locale === 'ar' ? 'السابق' : 'Back'}
              </button>
              <button
                type="submit"
                className="bg-on-tertiary-container text-[#361f1a] font-label-md text-xs px-8 py-3.5 hover:opacity-95 transition-all font-bold cursor-pointer border-0"
              >
                {locale === 'ar' ? 'إرسال التهنئة' : 'Submit Wish'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: Success message & Confetti */}
        {step === 4 && (
          <div className="text-center py-8 flex flex-col items-center gap-6">
            <span className="material-symbols-outlined text-6xl text-[#c59e62] animate-bounce" style={{ fontVariationSettings: "'FILL' 1" }}>
              workspace_premium
            </span>
            <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
              {locale === 'ar' ? 'تم إرسال تهنئتك بنجاح!' : 'Wish Sent Successfully!'}
            </h3>
            <p className="font-body-md text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
              {locale === 'ar' 
                ? 'شكراً لك على مشاعرك النبيلة وتمنياتك الطيبة. تمت إضافة تهنئتك فوراً إلى الحائط الخاص بالطالب.' 
                : 'Thank you for your noble feelings and kind wishes. Your congratulations has been immediately posted on the student wall.'}
            </p>
            <button
              onClick={resetForm}
              className="bg-primary text-white font-label-md text-xs px-8 py-3.5 hover:bg-primary-container transition-all font-bold cursor-pointer mt-4 border-0"
            >
              {locale === 'ar' ? 'إرسال تهنئة أخرى' : 'Send Another Wish'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
