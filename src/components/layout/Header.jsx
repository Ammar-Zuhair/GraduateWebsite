import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function Header({ activePage, setActivePage }) {
  const { t, locale, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t('home') },
    //{ id: 'timeline', label: locale === 'ar' ? 'شريط الزمن' : 'Timeline' },
    //{ id: 'news', label: locale === 'ar' ? 'الأخبار' : 'News' },
    { id: 'map', label: locale === 'ar' ? 'موقع الحفل' : 'Venue Map' },
    { id: 'dean', label: locale === 'ar' ? 'كلمة العميد' : 'Dean Speech' },
    { id: 'students', label: t('students') },
    { id: 'memories', label: t('memories') },
    ...(user?.role !== 'student' ? [{ id: 'send-wish', label: locale === 'ar' ? 'إرسال تهنئة' : 'Send Wish' }] : []),
    { id: 'sponsors', label: locale === 'ar' ? 'الداعمون' : 'Sponsors' },
    // Show admin link if logged in as admin
    ...(user?.role === 'admin' ? [{ id: 'admin', label: locale === 'ar' ? 'لوحة التحكم' : 'Admin Panel' }] : []),
    // Show my profile and wishes links if logged in as student
    ...(user?.role === 'student' ? [
      { id: 'my-profile', label: locale === 'ar' ? 'الملف الشخصي' : 'My Profile' },
      { id: 'my-wishes', label: locale === 'ar' ? 'تهنئاتي' : 'My Wishes' }
    ] : [])
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setActivePage('home');
    setIsOpen(false);
  };

  return (
    <header className="bg-primary text-on-primary w-full border-b border-[#c59e62]/20 sticky top-0 z-50 transition-all duration-300 shadow-md">
      <div className="flex justify-between items-center w-full max-w-container-max mx-auto px-4 md:px-8 h-20">
        
        {/* Logo */}
        <div className="flex items-center h-full">
          <button
            onClick={() => handleNavClick('home')}
            className="font-headline-md text-headline-md text-[#c59e62] tracking-tighter hover:text-white transition-all text-right font-bold py-2 flex items-center leading-none select-none"
          >
            {locale === 'ar' ? 'دفعة 2026' : 'Class of 2026'}
          </button>
        </div>

        {/* Desktop Nav - Ample Spacing */}
        <nav className="hidden xl:flex items-center space-x-6 space-x-reverse rtl:space-x-reverse h-full">
          {navItems.map((item) => {
            const isStudentTabActive = item.id === 'students' && (activePage === 'students' || activePage === 'profile');
            const isActive = activePage === item.id || isStudentTabActive;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`font-body-md text-sm uppercase tracking-wider px-3 py-2 transition-all duration-150 relative h-full flex items-center ${
                  isActive
                    ? 'text-[#c59e62] font-bold border-b-2 border-[#c59e62] pb-1'
                    : 'text-on-primary/80 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Actions (Theme, Language, User State & CTA) */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Theme Toggle */}
          {/*<button
            onClick={toggleTheme}
            className="text-on-primary/80 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors flex items-center justify-center select-none"
            aria-label="Toggle dark mode"
          >
            <span className="material-symbols-outlined text-xl">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>*/}
        
          {/* Language Toggle */}
          {/*
          <button
            onClick={toggleLanguage}
            className="text-on-primary/80 hover:text-white px-3 py-1.5 font-body-md text-sm border border-on-primary/20 hover:bg-white/5 transition-all flex items-center gap-1.5 select-none"
          >
            <span className="material-symbols-outlined text-lg">language</span>
            {t('toggle_lang')}
          </button>
          */}
          
          {/* User Auth Info */}
          {user ? (
            <div className="flex items-center gap-3 pl-2 rtl:pl-0 rtl:pr-2 border-l border-on-primary/20 rtl:border-l-0 rtl:border-r">
              <div className="text-right">
                <p className="text-xs text-on-primary/60 font-semibold leading-none">{user.role === 'admin' ? (locale === 'ar' ? 'المشرف' : 'Admin') : (locale === 'ar' ? 'طالب' : 'Student')}</p>
                <p className="text-sm font-bold text-[#c59e62] leading-tight max-w-[100px] truncate">{user.name}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="text-on-primary/60 hover:text-error hover:bg-white/5 p-2 transition-colors flex items-center justify-center"
                title={locale === 'ar' ? 'تسجيل الخروج' : 'Logout'}
              >
                <span className="material-symbols-outlined text-lg">logout</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => handleNavClick('login')}
              className="bg-[#c59e62] text-primary font-bold text-xs px-5 py-2.5 hover:bg-[#ffdeae] hover:text-[#361f1a] transition-all border-0 whitespace-nowrap"
            >
              {locale === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
            </button>
          )}
        </div>

        {/* Mobile Buttons */}
        <div className="xl:hidden flex items-center gap-3">
          {!user && (
            <button 
              onClick={() => handleNavClick('login')}
              className="bg-[#c59e62] text-primary font-bold text-xs px-4 py-2 hover:bg-[#ffdeae] hover:text-[#361f1a] transition-all border-0 whitespace-nowrap"
            >
              {locale === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
            </button>
          )}
          
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="text-on-primary hover:text-[#c59e62] p-2 flex items-center justify-center"
            aria-label="Toggle navigation drawer"
          >
            <span className="material-symbols-outlined text-3xl font-bold">{isOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 top-20 bg-primary/98 backdrop-blur-md z-40 xl:hidden flex flex-col p-8 animate-fade-in border-t border-[#c59e62]/20 overflow-y-auto">
          <nav className="flex flex-col gap-6 text-center mt-6">
            {navItems.map((item) => {
              const isStudentTabActive = item.id === 'students' && (activePage === 'students' || activePage === 'profile');
              const isActive = activePage === item.id || isStudentTabActive;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`font-body-lg text-base uppercase py-3.5 border-b border-on-primary/10 block w-full transition-colors ${
                    isActive ? 'text-[#c59e62] font-bold' : 'text-on-primary/80 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            
            {user ? (
              <div className="mt-6 p-4 bg-white/5 flex flex-col gap-4 items-center">
                <div className="text-center">
                  <p className="text-xs text-[#c59e62] font-bold uppercase">{user.role === 'admin' ? (locale === 'ar' ? 'المشرف' : 'Admin') : (locale === 'ar' ? 'طالب' : 'Student')}</p>
                  <p className="text-base font-bold text-white mt-1">{user.name}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-transparent border border-outline-variant/30 text-white font-label-md py-3 px-6 w-full"
                >
                  {locale === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                </button>
              </div>
            ) : null}
          </nav>
        </div>
      )}
    </header>
  );
}
