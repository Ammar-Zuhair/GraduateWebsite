import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

const TIERS = {
  platinum: {
    order: 0,
    label_ar: '🏆 الرعاة البلاتينيون',
    label_en: '🏆 Platinum Sponsors',
    badge_ar: 'بلاتيني',
    badge_en: 'Platinum',
    bg: 'bg-gradient-to-br from-[#e8e8e8] via-[#f5f5f5] to-[#c8c8c8]',
    border: 'border-[#b0b0b0]',
    glow: 'shadow-[0_0_32px_rgba(180,180,180,0.45)]',
    badgeBg: 'bg-gradient-to-r from-[#a8a8a8] to-[#e0e0e0] text-[#222]',
    iconColor: 'text-[#888]',
    logoSize: 'w-28 h-28',
    cardSize: 'col-span-1 md:col-span-2',
    nameSize: 'text-2xl',
    icon: 'workspace_premium',
    shimmer: true,
    animate: 'hover:scale-[1.02]'
  },
  gold: {
    order: 1,
    label_ar: '🥇 الرعاة الذهبيون',
    label_en: '🥇 Gold Sponsors',
    badge_ar: 'ذهبي',
    badge_en: 'Gold',
    bg: 'bg-gradient-to-br from-[#fffbe6] via-[#FAF8F5] to-[#f5e6c8]',
    border: 'border-[#c59e62]',
    glow: 'shadow-[0_0_24px_rgba(197,158,98,0.35)]',
    badgeBg: 'bg-gradient-to-r from-[#c59e62] to-[#ffdeae] text-[#361f1a]',
    iconColor: 'text-[#c59e62]',
    logoSize: 'w-24 h-24',
    cardSize: 'col-span-1',
    nameSize: 'text-xl',
    icon: 'star',
    shimmer: false,
    animate: 'hover:scale-[1.015]'
  },
  silver: {
    order: 2,
    label_ar: '🥈 الرعاة الفضيون',
    label_en: '🥈 Silver Sponsors',
    badge_ar: 'فضي',
    badge_en: 'Silver',
    bg: 'bg-gradient-to-br from-[#f0f4f8] via-[#e8edf3] to-[#d8e0e8]',
    border: 'border-[#94a3b8]',
    glow: 'shadow-[0_0_16px_rgba(148,163,184,0.3)]',
    badgeBg: 'bg-gradient-to-r from-[#64748b] to-[#94a3b8] text-white',
    iconColor: 'text-[#64748b]',
    logoSize: 'w-20 h-20',
    cardSize: 'col-span-1',
    nameSize: 'text-lg',
    icon: 'military_tech',
    shimmer: false,
    animate: 'hover:scale-[1.01]'
  },
  bronze: {
    order: 3,
    label_ar: '🥉 الرعاة البرونزيون',
    label_en: '🥉 Bronze Sponsors',
    badge_ar: 'برونزي',
    badge_en: 'Bronze',
    bg: 'bg-gradient-to-br from-[#fdf0e8] via-[#f5e6d3] to-[#e8cdb0]',
    border: 'border-[#cd7f32]',
    glow: 'shadow-[0_0_12px_rgba(205,127,50,0.2)]',
    badgeBg: 'bg-gradient-to-r from-[#cd7f32] to-[#e8a87c] text-white',
    iconColor: 'text-[#cd7f32]',
    logoSize: 'w-16 h-16',
    cardSize: 'col-span-1',
    nameSize: 'text-base',
    icon: 'handshake',
    shimmer: false,
    animate: 'hover:scale-[1.008]'
  }
};

export default function SponsorsPage() {
  const { locale } = useLanguage();
  const { sponsors } = useData();

  // Group sponsors by tier
  const grouped = Object.keys(TIERS).reduce((acc, tier) => {
    acc[tier] = sponsors.filter(s => (s.tier || 'gold') === tier);
    return acc;
  }, {});

  const hasTierData = Object.values(grouped).some(list => list.length > 0);

  return (
    <div className="w-full max-w-container-max mx-auto px-4 md:px-8 py-12 md:py-24">

      {/* Hero Header */}
      <header className="text-center mb-20 relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-[#c59e62]/40 bg-[#c59e62]/5 text-[#c59e62] text-xs font-bold tracking-widest uppercase mb-5">
          <span className="material-symbols-outlined text-sm">handshake</span>
          {locale === 'ar' ? 'شكر وتقدير' : 'With Gratitude'}
        </div>
        <h1 className="text-4xl md:text-5xl text-primary font-bold leading-tight mb-4">
          {locale === 'ar' ? 'شركاء النجاح والداعمون' : 'Success Partners & Sponsors'}
        </h1>
        <div className="w-24 h-px bg-[#c59e62] mx-auto mb-6"></div>
        <p className="text-lg text-secondary max-w-2xl mx-auto leading-relaxed">
          {locale === 'ar'
            ? 'نتوجه بجزيل الشكر والتقدير لشركائنا والجهات الداعمة التي ساهمت في إنجاح حفل تخرج دفعة 2026.'
            : 'We extend our deepest gratitude to our sponsors and partners who supported the success of the Class of 2026 commencement.'}
        </p>

        {/* Tier Benefits Bar */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto text-xs">
          {Object.entries(TIERS).map(([key, tier]) => (
            <div key={key} className={`${tier.bg} border ${tier.border} p-3 flex flex-col items-center gap-1 transition-all duration-300 ${tier.animate}`}>
              <span className={`material-symbols-outlined text-xl ${tier.iconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>{tier.icon}</span>
              <span className={`font-black text-[11px] px-2 py-0.5 ${tier.badgeBg}`}>
                {locale === 'ar' ? tier.badge_ar : tier.badge_en}
              </span>
            </div>
          ))}
        </div>
      </header>

      {!hasTierData ? (
        <div className="text-center py-24 text-secondary">
          <span className="material-symbols-outlined text-5xl text-outline mb-4 block">handshake</span>
          <p className="text-lg font-bold">{locale === 'ar' ? 'لا يوجد داعمون حالياً.' : 'No sponsors yet.'}</p>
        </div>
      ) : (
        <div className="space-y-20">
          {Object.entries(TIERS)
            .sort(([, a], [, b]) => a.order - b.order)
            .map(([tierKey, tierConfig]) => {
              const tierSponsors = grouped[tierKey];
              if (!tierSponsors || tierSponsors.length === 0) return null;

              return (
                <section key={tierKey}>
                  {/* Tier Section Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`h-px flex-grow ${tierKey === 'platinum' ? 'bg-[#b0b0b0]' : tierKey === 'gold' ? 'bg-[#c59e62]' : tierKey === 'silver' ? 'bg-[#94a3b8]' : 'bg-[#cd7f32]'}`}></div>
                    <h2 className="text-lg font-black text-primary whitespace-nowrap flex items-center gap-2">
                      <span className={`material-symbols-outlined ${tierConfig.iconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>{tierConfig.icon}</span>
                      {locale === 'ar' ? tierConfig.label_ar : tierConfig.label_en}
                      <span className={`text-xs px-2 py-0.5 font-bold ${tierConfig.badgeBg}`}>
                        {tierSponsors.length}
                      </span>
                    </h2>
                    <div className={`h-px flex-grow ${tierKey === 'platinum' ? 'bg-[#b0b0b0]' : tierKey === 'gold' ? 'bg-[#c59e62]' : tierKey === 'silver' ? 'bg-[#94a3b8]' : 'bg-[#cd7f32]'}`}></div>
                  </div>

                  {/* Sponsor Cards Grid */}
                  <div className={`grid gap-6 ${tierKey === 'platinum' ? 'grid-cols-1 md:grid-cols-1 max-w-3xl mx-auto' : tierKey === 'gold' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
                    {tierSponsors.map(sponsor => (
                      <div
                        key={sponsor.id}
                        className={`relative ${tierConfig.bg} border ${tierConfig.border} ${tierConfig.glow} ${tierConfig.animate} transition-all duration-300 overflow-hidden`}
                      >
                        {/* Shimmer Effect for Platinum */}
                        {tierConfig.shimmer && (
                          <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-12 animate-[shimmer_3s_linear_infinite]"></div>
                          </div>
                        )}

                        {/* Tier Badge (corner ribbon) */}
                        <div className={`absolute top-0 left-0 ${tierConfig.badgeBg} px-3 py-1 text-[10px] font-black uppercase tracking-widest`}>
                          {locale === 'ar' ? tierConfig.badge_ar : tierConfig.badge_en}
                        </div>

                        <div className={`flex ${tierKey === 'platinum' ? 'flex-col md:flex-row' : 'flex-col'} gap-6 items-center p-8 pt-10`}>
                          {/* Logo */}
                          <div className={`bg-white/60 dark:bg-white/10 p-4 border ${tierConfig.border} flex items-center justify-center shrink-0 ${tierConfig.logoSize}`}>
                            {sponsor.logo_url ? (
                              <img
                                src={sponsor.logo_url}
                                alt={sponsor[`name_${locale}`]}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <span className={`material-symbols-outlined text-4xl ${tierConfig.iconColor}`}>business</span>
                            )}
                          </div>

                          {/* Info */}
                          <div className={`flex flex-col gap-3 ${tierKey === 'platinum' ? 'text-right rtl:text-right' : 'text-center'} w-full`}>
                            <h3 className={`${tierConfig.nameSize} text-primary font-black leading-tight`}>
                              {sponsor[`name_${locale}`]}
                            </h3>
                            {sponsor[`description_${locale}`] && (
                              <p className="text-sm text-on-surface-variant leading-relaxed">
                                {sponsor[`description_${locale}`]}
                              </p>
                            )}
                            {sponsor.website_link && (
                              <a
                                href={sponsor.website_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${tierConfig.iconColor} hover:opacity-80 transition-opacity font-bold text-xs inline-flex items-center gap-1.5 ${tierKey === 'platinum' ? '' : 'justify-center'}`}
                              >
                                <span className="material-symbols-outlined text-xs">open_in_new</span>
                                {locale === 'ar' ? 'زيارة الموقع الإلكتروني' : 'Visit Website'}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
        </div>
      )}

      {/* Become a Sponsor CTA */}
      <section className="mt-24 bg-gradient-to-br from-[#361f1a] to-[#251310] p-12 text-center text-[#FAF8F5] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,158,98,0.15)_0%,transparent_70%)]"></div>
        <div className="relative z-10">
          <span className="material-symbols-outlined text-5xl text-[#c59e62] mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
          <h2 className="text-2xl font-bold mb-3">
            {locale === 'ar' ? 'هل تريد أن تكون داعماً لدفعتنا؟' : 'Want to be a Sponsor?'}
          </h2>
          <p className="text-[#FAF8F5]/70 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            {locale === 'ar'
              ? 'انضم إلى قافلة الداعمين وأسهم في صنع ذكريات لا تُنسى لدفعة تقنية ومعمار ومحاسبة 2026 واحصل على الوصول لشبكة متميزة من المهندسين والمبدعين.'
              : 'Join our sponsors and help create unforgettable memories for the Tech, Arch & Accounting Class of 2026.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {Object.entries(TIERS).map(([key, tier]) => (
              <div key={key} className={`${tier.bg} border ${tier.border} px-5 py-2.5 text-xs font-black flex items-center gap-2 ${tier.animate} transition-all duration-300`}>
                <span className={`material-symbols-outlined text-sm ${tier.iconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>{tier.icon}</span>
                <span className="text-primary">{locale === 'ar' ? tier.badge_ar : tier.badge_en}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%) rotate(12deg); }
          100% { transform: translateX(100%) rotate(12deg); }
        }
      `}} />
    </div>
  );
}
