import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

export default function HomePage({ setActivePage }) {
  const { t, locale } = useLanguage();
  const { students, wishes, memories, stats } = useData();
  const [typedText, setTypedText] = useState('');
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [celebrationConfetti, setCelebrationConfetti] = useState([]);
  const confettiIdCounter = useRef(0);

  // Department description data
  const departmentsInfo = {
    it: {
      title: locale === 'ar' ? 'تقنية المعلومات' : 'Information Technology',
      concept: locale === 'ar' ? 'نبني الخوارزميات، نطور النظم، ونصنع لغة المستقبل.' : 'We build algorithms, develop systems, and craft the language of the future.',
      manifesto: locale === 'ar' 
        ? 'بين أسطر البرمجة وقواعد البيانات، سطر طلابنا رحلة تقنية مميزة لابتكار حلول برمجية ذكية تخدم الإنسانية وتدفع بعجلة التقدم الرقمي.'
        : 'Between programming codes and databases, our students paved an exceptional technical path to innovate smart software solutions serving humanity.',
      stats: locale === 'ar' ? 'مشاريع تقنية مبتكرة' : 'Innovative tech projects',
      icon: 'terminal'
    },
    arch: {
      title: locale === 'ar' ? 'الهندسة المعمارية' : 'Architecture',
      concept: locale === 'ar' ? 'نصمم المساحات، نشيد الأركان، ونرسم هوية المدن.' : 'We design spaces, erect structures, and draw the identity of cities.',
      manifesto: locale === 'ar'
        ? 'من خطوط الرسم اليدوية إلى النمذجة ثلاثية الأبعاد، مزج مهندسونا الفن بالعلم ليصمموا صروحاً معمارية توازن بين الجمال الوظيفي والاستدامة.'
        : 'From sketching lines to 3D modeling, our architects blended art with science to design structures balancing functional beauty and sustainability.',
      stats: locale === 'ar' ? 'مخططات وصروح مستدامة' : 'Sustainable design plans',
      icon: 'architecture'
    }
  };

  // Inspiring Arabic/English quotes list
  const graduationQuotes = [
    {
      ar: "العِلْمُ يَبْنِي بُيُوتاً لا عِمَادَ لَهَا .. وَالجَهْلُ يَهْدِمُ بَيْتَ العِزِّ وَالكَرَمِ",
      en: "Knowledge builds houses that have no pillars, while ignorance destroys the house of nobility and generosity.",
      author: "أحمد شوقي"
    },
    {
      ar: "من تقنية الفكر نرسخ الغد، ومن عمارة الأرض نشيد المستقبل.",
      en: "With cognitive technology we establish tomorrow, and with structural architecture we build the future.",
      author: "دفعة تقنية ومعمار"
    },
    {
      ar: "ليست البداية هي المهمة، بل الطريقة التي ننهي بها الرحلة لنبدأ أخرى أعظم.",
      en: "It is not the beginning that matters, but the way we conclude the journey to start a greater one.",
      author: "حكمة خريج"
    }
  ];

  // Rotate quotes every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % graduationQuotes.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Subtitle typewriter effect
  const subtitleText = locale === 'ar' 
    ? 'تقنية ومعمار: تمازج الإبداع البرمجي والجمال الهيكلي لدفعة تخرج 2026' 
    : 'Tech & Arch: The fusion of software innovation and structural beauty for the Class of 2026';
  
  useEffect(() => {
    let index = 0;
    setTypedText('');
    const interval = setInterval(() => {
      setTypedText(subtitleText.slice(0, index + 1));
      index++;
      if (index > subtitleText.length) {
        clearInterval(interval);
      }
    }, 50); // Speed of typing
    return () => clearInterval(interval);
  }, [locale, subtitleText]);

  // Statistics counters animation
  const [animStats, setAnimStats] = useState({
    students: 0,
    photos: 0,
    videos: 0,
    wishes: 0,
    visitors: 0
  });

  useEffect(() => {
    const duration = 2000;
    const steps = 50;
    const stepDuration = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setAnimStats({
        students: Math.min(Math.round((stats.students / steps) * step), stats.students),
        photos: Math.min(Math.round((stats.photos / steps) * step), stats.photos),
        videos: Math.min(Math.round((stats.videos / steps) * step), stats.videos),
        wishes: Math.min(Math.round((stats.wishes / steps) * step), stats.wishes),
        visitors: Math.min(Math.round((stats.visitors / steps) * step), stats.visitors)
      });

      if (step >= steps) {
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [stats]);

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [commenced, setCommenced] = useState(false);

  useEffect(() => {
    // Graduation Ceremony target: July 20, 2026 at 8:00 AM
    const targetTime = new Date('2026-07-20T08:00:00').getTime();

    const interval = setInterval(() => {
      const diff = targetTime - Date.now();
      if (diff <= 0) {
        clearInterval(interval);
        setCommenced(true);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (num) => String(num).padStart(2, '0');

  // Interactive custom confetti burst
  const triggerConfetti = () => {
    const newConfetti = [];
    const colors = ['#c59e62', '#ffdeae', '#361f1a', '#FAF8F5', '#8d5b4c'];
    
    for (let i = 0; i < 60; i++) {
      const id = confettiIdCounter.current++;
      newConfetti.push({
        id,
        x: Math.random() * 100, // random percentage width
        y: -10,
        size: Math.random() * 12 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        duration: Math.random() * 2.5 + 2,
        rotation: Math.random() * 360,
        shape: Math.random() > 0.5 ? 'circle' : 'square'
      });
    }

    setCelebrationConfetti(prev => [...prev, ...newConfetti]);

    // Clean up confetti elements after animation finishes
    setTimeout(() => {
      setCelebrationConfetti(prev => prev.filter(c => !newConfetti.find(nc => nc.id === c.id)));
    }, 5000);
  };

  useEffect(() => {
    // Trigger confetti immediately on load
    triggerConfetti();

    // Trigger confetti automatically every 5 seconds
    const confettiInterval = setInterval(() => {
      triggerConfetti();
    }, 5000);

    return () => clearInterval(confettiInterval);
  }, []);

  return (
    <div className="w-full flex flex-col items-center overflow-hidden bg-background relative">
      
      {/* Lightweight Custom Confetti Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
        {celebrationConfetti.map(c => (
          <div
            key={c.id}
            style={{
              position: 'absolute',
              left: `${c.x}vw`,
              top: `${c.y}vh`,
              width: `${c.size}px`,
              height: `${c.shape === 'circle' ? c.size : c.size / 2}px`,
              backgroundColor: c.color,
              borderRadius: c.shape === 'circle' ? '50%' : '2px',
              animation: `fallAndSpin ${c.duration}s linear forwards`,
              animationDelay: `${c.delay}s`,
              transform: `rotate(${c.rotation}deg)`,
              opacity: 0.8
            }}
          />
        ))}
      </div>

      {/* Styled custom keyframe animation injected directly */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fallAndSpin {
          0% {
            top: -10%;
            transform: translateX(0) rotate(0deg);
          }
          100% {
            top: 110%;
            transform: translateX(50px) rotate(720deg);
          }
        }
      `}} />

      {/* Elegant Hero Section */}
      <section className="relative min-h-[95vh] w-full flex flex-col justify-center items-center text-center px-4 py-16 overflow-hidden bg-gradient-to-b from-[#361f1a] to-[#251310] text-[#FAF8F5]">
        
        {/* Animated Gold Aura Background Effect */}
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] bg-[#c59e62] rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-[#8d5b4c] rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '12s' }}></div>
        </div>

        {/* Decorative Grid Lines Overlay (Architectural feel) */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(197,158,98,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(197,158,98,0.05)_1px,transparent_1px)] bg-[size:50px_50px] z-0"></div>

        <div className="relative z-10 max-w-container-max mx-auto flex flex-col items-center gap-6">
          
          {/* Cohort Logo with Glowing Golden Borders */}
          <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-r from-[#c59e62] via-[#ffdeae] to-[#c59e62] shadow-[0_0_25px_rgba(197,158,98,0.7)] hover:shadow-[0_0_40px_rgba(197,158,98,0.95)] transition-all duration-500 flex items-center justify-center animate-fade-in mb-2">
            <img 
              src="https://prsxwxpsuhkigtrntaqn.supabase.co/storage/v1/object/public/gallery/WhatsApp%20Image%202026-07-07%20at%2010.25.23%20PM.jpeg" 
              alt={locale === 'ar' ? 'شعار الدفعة' : 'Cohort Logo'} 
              className="w-full h-full object-cover rounded-full select-none"
            />
            {/* Ambient Pulse Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-[#c59e62] animate-ping opacity-20 pointer-events-none" style={{ animationDuration: '3s' }}></div>
          </div>

          {/* Decorative Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-[#c59e62]/40 rounded-full bg-[#FAF8F5]/5 backdrop-blur-md text-[#c59e62] text-xs font-bold tracking-widest uppercase animate-fade-in">
            <span className="material-symbols-outlined text-sm">school</span>
            {locale === 'ar' ? 'جامعة العلوم والتكنولوجيا' : 'University of Science and Technology'}
          </div>

          <div className="space-y-6 max-w-4xl">
            <h1 className="text-display-lg font-black text-white leading-tight drop-shadow-md select-none tracking-tight">
              {locale === 'ar' ? 'دفعة تقنية ومعمار' : 'Tech & Arch Cohort'}
              <span className="block text-gradient bg-gradient-to-r from-[#ffdeae] via-[#c59e62] to-[#ffdeae] bg-clip-text text-transparent mt-3 font-serif">
                2026
              </span>
            </h1>
            
            {/* Typewriter Subtitle */}
            <div className="h-12 flex justify-center items-center max-w-2xl mx-auto">
              <span className="text-body-lg text-lg md:text-xl text-[#ffdeae]/90 font-medium leading-relaxed">
                {typedText}
                <span className="animate-ping ml-1 font-bold">|</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 z-20">
            <button
              onClick={() => setActivePage('students')}
              className="bg-[#c59e62] text-primary font-bold text-sm px-8 py-4 hover:bg-[#ffdeae] hover:text-[#361f1a] transition-all duration-300 shadow-lg flex items-center justify-center gap-2 group border-0"
            >
              <span className="material-symbols-outlined text-lg transition-transform group-hover:scale-110">group</span>
              {locale === 'ar' ? 'دليل الخريجين' : 'Graduates Directory'}
            </button>
          </div>

          {/* Premium Statistics Counters Card */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-surface-container-high/15 border border-[#c59e62]/20 backdrop-blur-xl p-8 w-full max-w-4xl shadow-2xl mt-8">
            <div className="flex flex-col items-center border-r border-[#c59e62]/10 rtl:border-r-0 rtl:border-l">
              <span className="text-4xl font-extrabold text-[#c59e62] tracking-tight">{animStats.students}</span>
              <span className="text-xs text-[#FAF8F5]/70 mt-2 font-bold uppercase tracking-wider">{locale === 'ar' ? 'الطلاب' : 'Students'}</span>
            </div>
            <div className="flex flex-col items-center border-r border-[#c59e62]/10 rtl:border-r-0 rtl:border-l">
              <span className="text-4xl font-extrabold text-[#c59e62] tracking-tight">{animStats.photos}</span>
              <span className="text-xs text-[#FAF8F5]/70 mt-2 font-bold uppercase tracking-wider">{locale === 'ar' ? 'الصور' : 'Photos'}</span>
            </div>
            <div className="flex flex-col items-center border-r border-[#c59e62]/10 rtl:border-r-0 rtl:border-l">
              <span className="text-4xl font-extrabold text-[#c59e62] tracking-tight">{animStats.videos}</span>
              <span className="text-xs text-[#FAF8F5]/70 mt-2 font-bold uppercase tracking-wider">{locale === 'ar' ? 'الفيديوهات' : 'Videos'}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-extrabold text-[#c59e62] tracking-tight">{animStats.wishes}</span>
              <span className="text-xs text-[#FAF8F5]/70 mt-2 font-bold uppercase tracking-wider">{locale === 'ar' ? 'التهاني' : 'Wishes'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Department Concept Showdown (Fusing IT & Architecture) */}
      <section className="py-24 w-full px-4 bg-surface-container relative">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl text-primary font-bold">{locale === 'ar' ? 'ثنائية العطاء: الفكر والبناء' : 'The Duality of Thought & Form'}</h2>
            <div className="w-24 h-px bg-[#c59e62] mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* IT card */}
            <div className="bg-background border border-[#c59e62]/20 p-8 hover:border-[#c59e62] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
              <div className="absolute top-0 right-0 rtl:right-auto rtl:left-0 w-24 h-24 bg-[#c59e62]/5 rounded-bl-full rtl:rounded-bl-none rtl:rounded-br-full flex items-center justify-center group-hover:bg-[#c59e62]/10 transition-colors">
                <span className="material-symbols-outlined text-3xl text-[#c59e62]">{departmentsInfo.it.icon}</span>
              </div>
              <div className="space-y-4">
                <span className="text-xs text-[#c59e62] font-bold uppercase tracking-widest">{locale === 'ar' ? 'تقنية المعلومات' : 'IT Department'}</span>
                <h3 className="text-2xl font-bold text-primary">{departmentsInfo.it.title}</h3>
                <p className="text-sm font-semibold text-secondary italic">"{departmentsInfo.it.concept}"</p>
                <p className="text-sm text-on-surface-variant leading-relaxed pt-2">{departmentsInfo.it.manifesto}</p>
              </div>
              <div className="mt-8 pt-4 border-t border-outline-variant/30 flex items-center justify-between">
                <span className="text-xs text-secondary font-bold">{departmentsInfo.it.stats}</span>
                <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform duration-300">arrow_right_alt</span>
              </div>
            </div>

            {/* Architecture card */}
            <div className="bg-background border border-[#c59e62]/20 p-8 hover:border-[#c59e62] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
              <div className="absolute top-0 right-0 rtl:right-auto rtl:left-0 w-24 h-24 bg-[#c59e62]/5 rounded-bl-full rtl:rounded-bl-none rtl:rounded-br-full flex items-center justify-center group-hover:bg-[#c59e62]/10 transition-colors">
                <span className="material-symbols-outlined text-3xl text-[#c59e62]">{departmentsInfo.arch.icon}</span>
              </div>
              <div className="space-y-4">
                <span className="text-xs text-[#c59e62] font-bold uppercase tracking-widest">{locale === 'ar' ? 'الهندسة المعمارية' : 'Architecture'}</span>
                <h3 className="text-2xl font-bold text-primary">{departmentsInfo.arch.title}</h3>
                <p className="text-sm font-semibold text-secondary italic">"{departmentsInfo.arch.concept}"</p>
                <p className="text-sm text-on-surface-variant leading-relaxed pt-2">{departmentsInfo.arch.manifesto}</p>
              </div>
              <div className="mt-8 pt-4 border-t border-outline-variant/30 flex items-center justify-between">
                <span className="text-xs text-secondary font-bold">{departmentsInfo.arch.stats}</span>
                <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform duration-300">arrow_right_alt</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Animated Quotes Carousel */}
      <section className="py-20 w-full bg-[#361f1a] text-[#FAF8F5] relative overflow-hidden border-t border-b border-[#c59e62]/20">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,rgba(197,158,98,0.2)_0%,transparent_80%)]"></div>
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <span className="material-symbols-outlined text-5xl text-[#c59e62] opacity-60 mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>
            format_quote
          </span>
          
          <div className="min-h-[140px] flex flex-col justify-center transition-all duration-500">
            <p className="text-xl md:text-2xl leading-relaxed font-serif italic mb-6">
              "{quoteIndex < graduationQuotes.length ? graduationQuotes[quoteIndex][locale] : ''}"
            </p>
            <span className="text-sm text-[#c59e62] font-bold tracking-widest uppercase">
              — {quoteIndex < graduationQuotes.length ? graduationQuotes[quoteIndex].author : ''}
            </span>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {graduationQuotes.map((_, i) => (
              <button
                key={i}
                onClick={() => setQuoteIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === quoteIndex ? 'bg-[#c59e62] w-6' : 'bg-white/30'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>



      {/* Styled Countdown Card Section */}
      <section className="py-24 w-full px-4 bg-background">
        <div className="max-w-container-max mx-auto text-center">
          <h2 className="text-3xl text-primary font-bold mb-10">
            {commenced 
              ? (locale === 'ar' ? 'انطلقت المسيرة والاحتفال' : 'The Commencement Concluded')
              : (locale === 'ar' ? 'العد التنازلي للتتويج الرسمي' : 'Commencement Countdown')}
          </h2>

          {commenced ? (
            <div className="max-w-2xl mx-auto bg-[#F5E6D3] p-10 border border-[#c59e62]/30 shadow-md">
              <span className="material-symbols-outlined text-5xl text-[#c59e62] mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>
                workspace_premium
              </span>
              <p className="text-lg text-primary leading-relaxed font-bold font-serif">
                {locale === 'ar' 
                  ? 'انطلقت مراسيم التخرج واحتفلنا بثمار السهر والمثابرة. نتمنى لدفعتنا "تقنية ومعمار" حياة مهنية مليئة بالنجاحات الباهرة.'
                  : 'The commencement ceremony has launched. We celebrated our perseverance and hard work. Wishing our cohort a successful career.'}
              </p>
            </div>
          ) : (
            <div className="flex justify-center gap-2 sm:gap-6 md:gap-10 bg-surface-container-high p-6 sm:p-10 border border-[#c59e62]/20 max-w-xl mx-auto shadow-2xl relative w-full overflow-hidden">
              
              {/* Pocket Watch Frame decorations */}
              <div className="absolute -top-3 left-4 w-6 h-1 bg-[#c59e62]"></div>
              <div className="absolute -top-3 right-4 w-6 h-1 bg-[#c59e62]"></div>

              <div className="flex flex-col items-center min-w-[55px] sm:min-w-[70px]">
                <span className="text-3xl sm:text-4xl md:text-5xl font-black text-primary tracking-tight font-mono">{formatTime(timeLeft.days)}</span>
                <span className="text-[10px] sm:text-xs text-secondary uppercase font-bold mt-2">{t('days')}</span>
              </div>
              <div className="w-px bg-outline-variant/30 h-12 sm:h-16 self-center"></div>
              
              <div className="flex flex-col items-center min-w-[55px] sm:min-w-[70px]">
                <span className="text-3xl sm:text-4xl md:text-5xl font-black text-primary tracking-tight font-mono">{formatTime(timeLeft.hours)}</span>
                <span className="text-[10px] sm:text-xs text-secondary uppercase font-bold mt-2">{t('hours')}</span>
              </div>
              <div className="w-px bg-outline-variant/30 h-12 sm:h-16 self-center"></div>
              
              <div className="flex flex-col items-center min-w-[55px] sm:min-w-[70px]">
                <span className="text-3xl sm:text-4xl md:text-5xl font-black text-primary tracking-tight font-mono">{formatTime(timeLeft.minutes)}</span>
                <span className="text-[10px] sm:text-xs text-secondary uppercase font-bold mt-2">{t('mins')}</span>
              </div>
              <div className="w-px bg-outline-variant/30 h-12 sm:h-16 self-center"></div>

              <div className="flex flex-col items-center min-w-[55px] sm:min-w-[70px]">
                <span className="text-3xl sm:text-4xl md:text-5xl font-black text-[#c59e62] tracking-tight font-mono animate-pulse">{formatTime(timeLeft.seconds)}</span>
                <span className="text-[10px] sm:text-xs text-secondary uppercase font-bold mt-2">{locale === 'ar' ? 'ثانية' : 'Sec'}</span>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
