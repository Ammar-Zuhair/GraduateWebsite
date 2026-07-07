import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function TimelinePage() {
  const { locale } = useLanguage();
  const [activeDept, setActiveDept] = useState('it'); // 'it' or 'arch'

  const itTimeline = [
    {
      year: '2022',
      title: { ar: 'خطواتنا الأولى وشغف البداية', en: 'First Steps & Rising Passion' },
      desc: { 
        ar: 'التقينا كزملاء في تخصص تقنية المعلومات، حيث بدأنا رحلة تعلم أساسيات البرمجة، والتعرف على خبايا الحاسوب ونظم التشغيل.', 
        en: 'Met as IT colleagues, initiating our journey into programming basics, computer architectures, and operating systems.' 
      },
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop'
    },
    {
      year: '2023',
      title: { ar: 'التعمق في البرمجة وهندسة البرمجيات', en: 'Deep Dive & Software Engineering' },
      desc: { 
        ar: 'مرحلة هندسة البرمجيات، هياكل البيانات، وقواعد البيانات وتطوير تطبيقات الويب والمواقع حيث برزت روح العمل الجماعي.', 
        en: 'Stepping into software engineering, data structures, and database design. Group projects brought our team spirit alive.' 
      },
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop'
    },
    {
      year: '2024',
      title: { ar: 'التدريب العملي والتحضير لسوق العمل', en: 'Practical Internships & Industrial Prep' },
      desc: { 
        ar: 'خرجنا إلى الميدان وبدأنا تدريبنا العملي في شركات التكنولوجيا والاتصالات، وواجهنا التحديات الواقعية للأنظمة البرمجية الكبيرة.', 
        en: 'Pushed limits during practical training inside telecom and tech firms, tackling real-world distributed system challenges.' 
      },
      image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=600&auto=format&fit=crop'
    },
    {
      year: '2025',
      title: { ar: 'مشاريع التخرج والابتكار الرقمي', en: 'Graduation Projects & Digital Innovation' },
      desc: { 
        ar: 'بدأت رحلة التميز الحقيقي بابتكار أفكار مشاريع تخرج نوعية، من الذكاء الاصطناعي إلى تطبيقات الهاتف الذكي وحلول الأمن السيبراني.', 
        en: 'Formulating innovative graduation project solutions, scaling mobile apps, AI integrations, and cybersecurity safeguards.' 
      },
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop'
    },
    {
      year: '2026',
      title: { ar: 'مناقشة المشاريع وحفل التخرج الكلاسيكي', en: 'Project Defense & Golden Graduation' },
      desc: { 
        ar: 'اليوم الأسمى، حيث ناقشنا المشاريع بنجاح باهر وتوجت دفعة تقنية المعلومات بحفل التخرج المهيب استعداداً لبناء المستقبل.', 
        en: 'The ultimate defense milestone. IT graduates successfully defended their work, marching to the commencement ceremony.' 
      },
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop'
    }
  ];

  const archTimeline = [
    {
      year: '2022',
      title: { ar: 'أقلام الرسم والخطوط الهندسية الأولى', en: 'Drafting Boards & First Blueprint Lines' },
      desc: { 
        ar: 'بداية الرحلة في استوديو العمارة، التعرف على أدوات الرسم الحر، الرسم الهندسي ومبادئ الظل والنور والمنظور.', 
        en: 'Beginning in the Architecture Studio, learning manual drafting, perspective drawing, and the principles of light and shadows.' 
      },
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=600&auto=format&fit=crop'
    },
    {
      year: '2023',
      title: { ar: 'تاريخ العمارة ونمذجة المجسمات', en: 'Architectural History & Scale Modeling' },
      desc: { 
        ar: 'التعمق في تاريخ العمارة الكلاسيكية والحديثة وصنع المجسمات الكرتونية والخشبية التي جسدت أفكارنا الهيكلية.', 
        en: 'Immersing in ancient & modern architectural histories while fabricating detailed wood and board scale models.' 
      },
      image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=600&auto=format&fit=crop'
    },
    {
      year: '2024',
      title: { ar: 'التصميم البيئي وزيارات مواقع البناء', en: 'Environmental Design & Site Surveys' },
      desc: { 
        ar: 'دراسة استدامة المباني والتصميم المتوافق مع البيئة، وتنظيم رحلات وزيارات ميدانية لمشاريع قيد الإنشاء لدراسة الهياكل الخرسانية.', 
        en: 'Exploring structural stability, green construction, and touring large-scale building sites under construction.' 
      },
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600&auto=format&fit=crop'
    },
    {
      year: '2025',
      title: { ar: 'صياغة المخططات ورسم فكرة التخرج', en: 'Blueprint Layouts & Graduation Concept' },
      desc: { 
        ar: 'العمل الشاق على مشاريع التخرج الإنشائية الكبرى، ورسم وتصميم الواجهات ثلاثية الأبعاد والمخططات التنفيذية التفصيلية.', 
        en: 'Hard work drafting complex structural assemblies, designing detailed plans, and rendering 3D digital walkthroughs.' 
      },
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop'
    },
    {
      year: '2026',
      title: { ar: 'عرض مشاريع التخرج أمام لجان التحكيم', en: 'Jury Presentations & Cohort Crowning' },
      desc: { 
        ar: 'عرض المشاريع النهائية وتفاصيلها الهندسية أمام لجان التحكيم الأكاديمية بنجاح باهر، والاحتفاء بالانتقال من الرسم إلى البناء الحقيقي.', 
        en: 'Defending ultimate design portfolios in front of expert juries, ready to transform drawings into real sky-high structures.' 
      },
      image: 'https://images.unsplash.com/photo-1525921429624-479b6c294a40?q=80&w=600&auto=format&fit=crop'
    }
  ];

  const activeTimeline = activeDept === 'it' ? itTimeline : archTimeline;

  return (
    <div className="w-full max-w-container-max px-4 py-16 mx-auto bg-background">
      {/* Title Header */}
      <div className="text-center mb-12">
        <h1 className="text-display-lg text-primary font-bold mb-4">
          {locale === 'ar' ? 'شريط زمن الدفعة' : 'Cohort Timeline'}
        </h1>
        <div className="w-24 h-px bg-[#c59e62] mx-auto mb-6"></div>
        <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          {locale === 'ar' 
            ? 'رحلتنا من الخطوات الجامعية الأولى وحتى التتويج في حفل التخرج.' 
            : 'Our steps from the first campus entry to the ultimate graduation celebration.'}
        </p>
      </div>

      {/* Tabs Selector for IT vs Architecture */}
      <div className="flex justify-center gap-4 mb-16 select-none">
        <button
          onClick={() => setActiveDept('it')}
          className={`flex items-center gap-2 px-6 py-3 border-0 transition-all duration-300 font-bold ${
            activeDept === 'it'
              ? 'bg-[#c59e62] text-primary shadow-lg scale-105'
              : 'bg-[#F5E6D3]/60 dark:bg-surface-container/60 text-secondary hover:bg-[#F5E6D3]'
          }`}
        >
          <span className="material-symbols-outlined text-lg">terminal</span>
          {locale === 'ar' ? 'شريط زمن تقنية المعلومات' : 'IT Department Timeline'}
        </button>

        <button
          onClick={() => setActiveDept('arch')}
          className={`flex items-center gap-2 px-6 py-3 border-0 transition-all duration-300 font-bold ${
            activeDept === 'arch'
              ? 'bg-[#c59e62] text-primary shadow-lg scale-105'
              : 'bg-[#F5E6D3]/60 dark:bg-surface-container/60 text-secondary hover:bg-[#F5E6D3]'
          }`}
        >
          <span className="material-symbols-outlined text-lg">architecture</span>
          {locale === 'ar' ? 'شريط زمن الهندسة المعمارية' : 'Architecture Timeline'}
        </button>
      </div>

      {/* Timeline Section */}
      <div className="relative max-w-4xl mx-auto">
        {/* Central Vertical Line */}
        <div className={`absolute top-0 bottom-0 w-1 bg-[#c59e62]/30 ${locale === 'ar' ? 'right-1/2 translate-x-1/2' : 'left-1/2 -translate-x-1/2'} hidden md:block`}></div>

        <div className="space-y-16">
          {activeTimeline.map((item, index) => {
            const isEven = index % 2 === 0;
            // Layout styling for left/right alignment
            const alignmentClass = isEven 
              ? (locale === 'ar' ? 'md:flex-row-reverse' : 'md:flex-row') 
              : (locale === 'ar' ? 'md:flex-row' : 'md:flex-row-reverse');
            const textAlignmentClass = isEven 
              ? 'md:text-left rtl:md:text-right' 
              : 'md:text-right rtl:md:text-left';

            return (
              <div 
                key={item.year} 
                className={`relative flex flex-col md:flex-row items-center justify-between w-full gap-8 md:gap-0 ${alignmentClass}`}
              >
                {/* Visual Card containing text description & date */}
                <div className="w-full md:w-[45%] z-10">
                  <div className="bg-[#F5E6D3] dark:bg-surface-container border border-[#c59e62]/20 shadow-md hover:border-[#c59e62] transition-colors duration-300 p-6 flex flex-col gap-4">
                    {/* Floating year bubble */}
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-black text-[#c59e62]">{item.year}</span>
                      <span className="material-symbols-outlined text-[#c59e62]/60 text-sm">
                        {activeDept === 'it' ? 'code' : 'design_services'}
                      </span>
                    </div>

                    {/* Event image */}
                    <div className="w-full h-44 overflow-hidden border border-[#c59e62]/10">
                      <img 
                        src={item.image} 
                        alt={item.title[locale]} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 select-none"
                      />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-primary mb-2">
                        {item.title[locale]}
                      </h3>
                      <p className="text-sm text-on-surface-variant leading-relaxed">
                        {item.desc[locale]}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Central Circle Node for timeline link */}
                <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#361f1a] border-4 border-[#FAF8F5] dark:border-background z-20 shadow-lg hidden md:flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#c59e62]"></span>
                </div>

                {/* Spacing holder to keep columns balanced in desktop */}
                <div className="hidden md:block w-[45%]"></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
