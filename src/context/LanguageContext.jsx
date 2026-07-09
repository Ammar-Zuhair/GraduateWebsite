import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  ar: {
    // Navbar
    home: 'الرئيسية',
    students: 'الطلاب',
    memories: 'الذكريات',
    wishes: 'التهاني',
    join_us: 'انضم إلينا',
    logo: 'جامعة العلوم والتكنولوجيا',
    toggle_lang: 'English',
    
    // Home Page
    hero_title: 'دفعة تقنية ومعمار 2026',
    hero_subtitle: 'حفل التخرج',
    hero_desc: 'انضم إلينا في الاحتفال بإرث من التميز والمستقبل المشرق لخريجينا.',
    days: 'أيام',
    hours: 'ساعات',
    mins: 'دقائق',
    
    dean_title: 'كلمة العميد',
    dean_speech: 'بسم الله الرحمن الرحيم. أبنائي وبناتي الخريجين، اليوم نقف على أعتاب مرحلة جديدة في حياتكم. لقد أثبتم جدارتكم وتفانيكم خلال سنوات دراستكم في هذا الصرح الأكاديمي العريق. إن إنجازكم اليوم ليس مجرد شهادة، بل هو بداية لرحلة طويلة من العطاء والتميز. أتمنى لكم مستقبلاً مشرقاً ومليئاً بالنجاحات.',
    dean_name: 'د. محمد الليمه',
    dean_role: 'عميد الكلية',
    
    events_title: 'جدول الفعاليات',
    event1_time: '08:00 صباحاً',
    event1_title: 'وصول الضيوف',
    event1_desc: 'نرحب بالعائلات والضيوف لأخذ مقاعدهم في القاعة الكبرى. يوصى بالحضور المبكر.',
    event2_time: '10:00 صباحاً',
    event2_title: 'حفل التخرج',
    event2_desc: 'يبدأ الموكب الأكاديمي، يليه النشيد الوطني والكلمة الافتتاحية من رئيس الجامعة.',
    event2_badge: 'الحدث الرئيسي',
    event3_time: '01:00 مساءً',
    event3_title: 'تسليم الشهادات',
    event3_desc: 'سيعبر الخريجون المسرح لاستلام شهاداتهم. سيتوفر تصوير احترافي.',
    
    // Graduates Page
    dir_title: 'دليل خريجي 2026',
    dir_subtitle: 'احتفل بإنجازات وتراث أكاديمي لخريجينا المتميزين. تصفح حسب القسم أو ابحث عن خريجين محددين.',
    search_placeholder: 'ابحث بالاسم...',
    filter_dept_all: 'جميع الأقسام',
    
    filter_btn: 'تصفية',
    load_more_grads: 'تحميل المزيد من الخريجين',
    honors_first: 'مرتبة الشرف الأولى',
    honors_second: 'مرتبة الشرف الثانية',
    honors_distinguished: 'طالب متفوق',
    
    // Memories Page
    mem_title: 'لحظات خالدة',
    mem_subtitle: 'مجموعة من الذكريات الملتقطة من رحلتنا الأكاديمية. استكشف معرض الوجوه والاحتفالات والانتصارات المشتركة التي تميز دفعة التخرج لدينا.',
    load_more_memories: 'تحميل المزيد من الذكريات',
    mem_el_vance: 'إليانور فانس',
    mem_class_26: 'دفعة 2026',
    mem_friends: 'أصدقاء للأبد',
    mem_certificate: 'الشهادة',
    mem_campus: 'الحرم الجامعي عند الغسق',
    mem_prof: 'أ.د. إتش. ستيرلينغ',
    
    // Wishes Page
    wishes_title: 'اترك أمنياتك',
    wishes_subtitle: 'انضم إلينا في الاحتفال بالإنجازات الاستثنائية لدفعة 2026. شارك رسائل التشجيع، والذكريات، والآمال لمستقبلهم المشرق.',
    form_title: 'توقيع الكتاب السنوي الرقمي',
    label_name: 'الاسم',
    placeholder_name: 'مثال: البروفيسور سميث',
    label_relation: 'علاقتك بالخريج',
    placeholder_relation: 'عائلة، صديق، هيئة تدريس...',
    label_message: 'رسالتك',
    placeholder_message: 'اكتب أمنياتك وتهانيك هنا...',
    submit_btn: 'إرسال التهاني',
    wishes_wall_title: 'حائط الأمنيات',
    wishes_recent: 'الرسائل الأخيرة',
    load_more_wishes: 'تحميل المزيد من الأمنيات',
    wishes_featured: 'مميز',
    
   
    privacy_policy: 'سياسة الخصوصية',
    copyright: '© 2026 لجنة تخرج تقنية ومعمار ومحاسبة. جميع الحقوق محفوظة.',
    
    // Toast alerts
    wish_added: 'تمت إضافة تهنئتك بنجاح!',
    fill_fields: 'يرجى ملء جميع الحقول المطلوبة.',
  },
  en: {
    // Navbar
    home: 'Home',
    students: 'Students',
    memories: 'Memories',
    wishes: 'Congratulations',
    join_us: 'Join Us',
    logo: 'ALMA MATER',
    toggle_lang: 'العربية',
    
    // Home Page
    hero_title: 'Class of 2026',
    hero_subtitle: 'Commencement Ceremony',
    hero_desc: 'Join us in celebrating a legacy of excellence and the bright future of our graduates.',
    days: 'Days',
    hours: 'Hours',
    mins: 'Mins',
    
    dean_title: 'A Word from the Dean',
    dean_speech: 'In the name of God, the most gracious, the most merciful. My sons and daughters, the graduates, today we stand on the threshold of a new phase in your lives. You have proven your worth and dedication during your years of study in this ancient academic edifice. Your achievement today is not just a certificate, but the beginning of a long journey of giving and excellence. I wish you a bright future full of success.',
    dean_name: 'Dr. Ahmed Al-Farsi',
    dean_role: 'Dean of Faculty',
    
    events_title: 'Event Schedule',
    event1_time: '08:00 AM',
    event1_title: 'Guest Arrival',
    event1_desc: 'Families and guests are welcome to take their seats in the grand auditorium. Early arrival is recommended.',
    event2_time: '10:00 AM',
    event2_title: 'Commencement',
    event2_desc: 'The academic procession begins, followed by the national anthem and opening remarks from the chancellor.',
    event2_badge: 'Main Event',
    event3_time: '01:00 PM',
    event3_title: 'Degree Conferral',
    event3_desc: 'Graduates will cross the stage to receive their diplomas. Professional photography will be available.',
    
    // Graduates Page
    dir_title: 'Class of 2026 Directory',
    dir_subtitle: 'Celebrate the achievements and academic heritage of our distinguished graduates. Browse by department or search for specific graduates.',
    search_placeholder: 'Search by name...',
    filter_dept_all: 'All Departments',
    filter_dept_arts: 'Department of Arts',
    filter_dept_science: 'College of Science',
    filter_dept_engineering: 'College of Engineering',
    filter_year_all: 'All Batches',
    filter_year_2026: 'Class of 2026',
    filter_year_2025: 'Class of 2025',
    filter_btn: 'Filter',
    load_more_grads: 'Load More Graduates',
    honors_first: 'First Class Honors',
    honors_second: 'Second Class Honors',
    honors_distinguished: 'Valedictorian',
    
    // Memories Page
    mem_title: 'Eternal Moments',
    mem_subtitle: 'A collection of moments captured from our academic journey. Explore the gallery of faces, celebrations, and shared triumphs that define our graduating class.',
    load_more_memories: 'Load More Memories',
    mem_el_vance: 'Eleanor Vance',
    mem_class_26: 'Class of 2026',
    mem_friends: 'Friends Forever',
    mem_certificate: 'The Diploma',
    mem_campus: 'Campus at Dusk',
    mem_prof: 'Prof. H. Sterling',
    
    // Wishes Page
    wishes_title: 'Leave Your Wishes',
    wishes_subtitle: 'Join us in celebrating the exceptional achievements of the Class of 2026. Share messages of encouragement, memories, and hopes for their bright future.',
    form_title: 'Sign the Digital Yearbook',
    label_name: 'Name',
    placeholder_name: 'e.g. Professor Smith',
    label_relation: 'Relation',
    placeholder_relation: 'Family, friend, faculty...',
    label_message: 'Your Message',
    placeholder_message: 'Write your wishes and congratulations here...',
    submit_btn: 'Send Wishes',
    wishes_wall_title: 'Wishes Wall',
    wishes_recent: 'Recent Messages',
    load_more_wishes: 'Load More Wishes',
    wishes_featured: 'Featured',
    
    // Footer
    dept_arts: 'Department of Arts',
    dept_science: 'College of Science',
    dept_alumni: 'Alumni Association',
    privacy_policy: 'Privacy Policy',
    copyright: '© 2026 Tech, Arch & Accounting Graduation Committee. All Rights Reserved.',
    
    // Toast alerts
    wish_added: 'Your wish has been successfully added!',
    fill_fields: 'Please fill in all required fields.',
  }
};

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState('ar');

  const toggleLanguage = () => {
    setLocale((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  useEffect(() => {
    // Dynamically update document properties
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.title = locale === 'ar' ? 'حفل التخرج - دفعة 2026' : 'Class of 2026 - Graduation';
  }, [locale]);

  const t = (key) => {
    return translations[locale][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
