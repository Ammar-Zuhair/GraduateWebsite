import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

const fallbackDoctors = [
  {
    id: 'fallback-1',
    name_ar: 'م.م/جميل السيد حسن النهاري',
    name_en: 'L. Jamil Al-Sayyid Hasan Al-Nahari',
    speech_ar: 'زملاء المستقبل، لقد صقلتم مهاراتكم في أعقد النظم التقنية، واليوم تبدأ رحلتكم الحقيقية في تحويل التحديات البرمجية إلى حلولٍ ذكية تخدم المجتمع. لا تتوقفوا عند حدود ما تعلمتموه؛ فالعالم الرقمي يتطور بمنطقِ المبدعين، وأنتم اليوم تملكون الأدوات التي تجعلكم صناعاً للقرار في مساراتكم المهنية. اجعلوا من أخلاقيات التقنية بوصلتكم، ومن الطموح وقوداً لا ينضب؛ فالمستقبل ينتظر ما ستصيغونه بأيديكم من ابتكارات تقنية تغير واقعنا للأفضل. مبارك لكم هذا التخرج، انطلقوا بثقةٍ واقتدار، فأنتم الجيل الذي يمسك بزمام التحول الرقمي ويرسم ملامح الغد بكل تفوقٍ وتميز.',
    speech_en: 'Future colleagues, you have honed your skills in the most complex technical systems, and today your real journey begins in turning software challenges into smart solutions serving society. Do not stop at the limits of what you have learned; the digital world evolves with the logic of creators, and today you possess the tools that make you decision-makers in your professional career. Make tech ethics your compass, and ambition an inexhaustible fuel; the future awaits what you will formulate with your hands of technical innovations changing our reality for the better. Congratulations on your graduation, launch with confidence and competence, for you are the generation holding the reins of digital transformation and drawing the features of tomorrow with excellence.',
    title_ar: 'مدرس مساعد - قسم تقنية المعلومات',
    title_en: 'Assistant Lecturer - IT Department',
    image_url: 'https://api.dicebear.com/7.x/initials/svg?seed=Jamil'
  },
  {
    id: 'fallback-2',
    name_ar: 'د. وليد الحكمي',
    name_en: 'Dr. Waleed Al-Hakami',
    speech_ar: 'خريجي وخريجات قسم الهندسة المعمارية، أبارك لكم هذا الإنجاز الذي جاء ثمرة سنواتٍ من الجد والاجتهاد والمثابرة، فقد أثبتم بإصراركم أن الطموح يصنع النجاح. لقد تجاوزتم تحديات الدراسة بروحٍ متميزة، واكتسبتم المعرفة والمهارة التي تؤهلكم لصناعة مستقبلٍ مشرق. واليوم تبدأون مرحلةً جديدة تحمل بين أيديكم مسؤولية الإبداع والإسهام في بناء مجتمعاتنا وترك بصمة معمارية تليق بكم. ثقوا بقدراتكم، وواصلوا التعلم والتطوير، واجعلوا من الأخلاق المهنية والإتقان عنوانًا لكل عمل تقدمونه. أسأل الله أن يوفقكم، وأن يجعل نجاحكم اليوم بدايةً لسلسلةٍ من الإنجازات والتميز في حياتكم العملية، وألف مبارك لكم هذا التخرج.',
    speech_en: 'Graduates of the Department of Architecture, I congratulate you on this achievement, which is the fruit of years of hard work, diligence, and perseverance. You have proven by your determination that ambition makes success. You have overcome the challenges of study with a distinguished spirit, and gained knowledge and skills that qualify you to build a bright future. Today, you begin a new phase, carrying the responsibility of creativity and contribution to building our communities and leaving an architectural fingerprint worthy of you. Trust your abilities, continue learning and development, and make professional ethics and mastery the title of every work you offer. I ask God to guide you and make your success today the beginning of a series of achievements in your practical life.',
    title_ar: 'رئيس قسم الهندسة المعمارية',
    title_en: 'Head of Architecture Department',
    image_url: 'https://api.dicebear.com/7.x/initials/svg?seed=Waleed'
  }
];

export default function DeanSpeechPage() {
  const { locale } = useLanguage();
  const { doctors } = useData();
  
  const displayDoctors = doctors.length > 0 ? doctors : fallbackDoctors;

  return (
    <div className="w-full max-w-container-max px-4 py-16 mx-auto">
      
      {/* Title Header */}
      <div className="text-center mb-16 relative">
        <h1 className="text-display-lg text-primary font-bold mb-4">
          {locale === 'ar' ? 'كلمات أعضاء هيئة التدريس ' : 'Faculty & Doctors Speeches'}
        </h1>
        <div className="w-24 h-px bg-[#c59e62] mx-auto mt-6"></div>
      </div>

      {/* Grid List of Doctors */}
      <div className="flex flex-col gap-12 max-w-5xl mx-auto">
        {displayDoctors.map((doc) => (
          <div 
            key={doc.id}
            className="bg-surface-container-high border border-outline-variant/30 p-8 shadow-sm flex flex-col md:flex-row gap-12 items-center relative hover:border-[#c59e62]/60 transition-colors"
          >
            {/* Photo Column */}
            <div className="w-full md:w-1/3 shrink-0 flex flex-col items-center">
              <div className="relative border-4 border-[#c59e62] p-2 bg-surface w-48 h-48 md:w-full md:h-auto aspect-square overflow-hidden group">
                <img 
                  src={doc.image_url || 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(doc.name_ar)} 
                  alt={doc.name_ar} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Speech Text Column */}
            <div className="w-full md:w-2/3 flex flex-col justify-center">
              <span className="material-symbols-outlined text-5xl text-[#c59e62]/40 mb-4 select-none font-serif">format_quote</span>
              <p className="text-base md:text-lg text-primary leading-relaxed font-serif italic mb-8 white-space-pre-line text-justify">
                {doc[`speech_${locale}`] || doc.speech_ar}
              </p>
              
              <div className="border-t border-outline-variant/30 pt-6">
                <h3 className="text-xl font-bold text-primary">{doc[`name_${locale}`] || doc.name_ar}</h3>
                <p className="text-secondary font-semibold mt-1">{doc[`title_${locale}`] || doc.title_ar}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
