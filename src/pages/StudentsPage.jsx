import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

export default function StudentsPage({ viewStudentProfile }) {
  const { t, locale } = useLanguage();
  const { students, wishes } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // asc or desc

  // Calculate wishes count for a student
  const getWishesCount = (studentId) => {
    return wishes.filter(w => w.student_id === studentId).length;
  };

  const getMajorName = (major) => {
    if (major === 'it') return locale === 'ar' ? 'تقنية معلومات' : 'Information Technology';
    if (major === 'arch') return locale === 'ar' ? 'هندسة معمارية' : 'Architecture';
    if (major === 'acc') return locale === 'ar' ? 'محاسبة' : 'Accounting';
    return major;
  };

  // Filter and Sort Students
  const filteredStudents = students
    .filter((grad) => {
      const isApproved = grad.status === 'approved' || (grad.status === undefined && grad.is_approved !== false);
      const gradName = grad[`name_${locale}`] || '';
      const nameMatch = gradName.toLowerCase().includes(searchQuery.toLowerCase());
      const deptMatch = deptFilter === '' || grad.major === deptFilter;
      return isApproved && nameMatch && deptMatch;
    })
    .sort((a, b) => {
      const nameA = (a[`name_${locale}`] || '').toLowerCase();
      const nameB = (b[`name_${locale}`] || '').toLowerCase();
      if (sortOrder === 'asc') {
        return nameA.localeCompare(nameB, locale === 'ar' ? 'ar' : 'en');
      } else {
        return nameB.localeCompare(nameA, locale === 'ar' ? 'ar' : 'en');
      }
    });

  return (
    <div className="w-full max-w-container-max mx-auto px-4 md:px-8 py-12 md:py-24">
      {/* Header */}
      <header className={`mb-16 text-center ${locale === 'ar' ? 'md:text-right' : 'md:text-left'}`}>
        <h1 className="text-4xl md:text-5xl text-primary mb-6 font-bold leading-tight">
          {locale === 'ar' ? 'دليل الخريجين المتميزين' : 'Graduates Directory'}
        </h1>
        <p className="text-lg text-secondary max-w-2xl leading-relaxed">
          {locale === 'ar' 
            ? 'تصفح دليل طلاب الدفعة وتعرف على مسيرتهم وتخصصاتهم الأكاديمية وأرسل تهنئة خاصة لهم.' 
            : 'Browse the graduates directory, explore their majors, achievements, and send them a special congratulations.'}
        </p>
      </header>

      {/* Filters Bar */}
      <section className="bg-surface-container-lowest/80 backdrop-blur-md border border-[#c59e62]/20 p-6 md:p-8 mb-16 flex flex-col lg:flex-row gap-6 items-center shadow-sm w-full">
        {/* Search */}
        <div className="w-full lg:w-1/3 relative">
          <span className={`material-symbols-outlined absolute ${locale === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-outline`}>
            search
          </span>
          <input
            type="text"
            className={`w-full bg-surface-container border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 ${locale === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 text-on-surface`}
            placeholder={locale === 'ar' ? 'ابحث عن طالب...' : 'Search student...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Department Filters */}
        <div className="w-full lg:w-2/3 flex flex-col sm:flex-row gap-6 w-full">
          <select
            className="w-full bg-surface-container border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-3 px-4 text-on-surface cursor-pointer"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="">{locale === 'ar' ? 'جميع التخصصات' : 'All Majors'}</option>
            <option value="arch">{locale === 'ar' ? 'هندسة معمارية' : 'Architecture'}</option>
            <option value="it">{locale === 'ar' ? 'تقنية معلومات' : 'Information Technology'}</option>
            <option value="acc">{locale === 'ar' ? 'محاسبة' : 'Accounting'}</option>
          </select>
          
          {/* Sorting */}
          <select
            className="w-full bg-surface-container border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-3 px-4 text-on-surface cursor-pointer"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">{locale === 'ar' ? 'الترتيب الأبجدي (أ-ي)' : 'Alphabetical (A-Z)'}</option>
            <option value="desc">{locale === 'ar' ? 'الترتيب الأبجدي (ي-أ)' : 'Alphabetical (Z-A)'}</option>
          </select>
        </div>
      </section>

      {/* Directory Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredStudents.map((grad) => (
          <article
            key={grad.id}
            onClick={() => viewStudentProfile(grad.id)}
            className="bg-[#F5E6D3] dark:bg-surface-container border border-outline-variant/20 p-8 flex flex-col items-center text-center transition-all duration-300 hover:border-[#c59e62] hover:bg-[#f3e5e1] dark:hover:bg-[#362421] relative group cursor-pointer shadow-sm"
          >
            <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center z-10 p-6 gap-3">
              <p className="text-xl text-[#c59e62] font-bold">{grad[`name_${locale}`]}</p>
              <span className="bg-[#c59e62] text-primary text-xs font-bold px-4 py-2 uppercase tracking-wider">
                {locale === 'ar' ? 'عرض الملف الشخصي' : 'View Profile'}
              </span>
            </div>
            
            {/* Avatar */}
            <div className="mb-6 relative z-0 w-28 h-28">
              <img
                className="w-28 h-28 object-cover rounded-full border-4 border-surface shadow-sm"
                src={grad.profile_image}
                alt={grad[`name_${locale}`]}
              />
            </div>
            
            {/* Details */}
            <h3 className="text-lg text-primary mb-2 font-bold leading-tight">{grad[`name_${locale}`]}</h3>
            <p className="text-sm text-secondary mb-3 flex items-center gap-1.5 justify-center font-semibold">
              <span className="material-symbols-outlined text-[15px] text-[#c59e62]">diamond</span>
              {getMajorName(grad.major)}
            </p>

          </article>
        ))}
      </section>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <div className="text-center py-24 bg-surface-container border border-outline-variant/10 w-full">
          <span className="material-symbols-outlined text-5xl text-outline mb-4">person_search</span>
          <p className="text-lg text-secondary font-bold">
            {locale === 'ar' ? 'لا يوجد نتائج تطابق بحثك.' : 'No graduates found matching your search criteria.'}
          </p>
        </div>
      )}
    </div>
  );
}
