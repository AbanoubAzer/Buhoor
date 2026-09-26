export type Language = 'ar' | 'en';

export const translations = {
  ar: {
    // Navigation & Common
    home: 'الرئيسية',
    units: 'العقارات',
    projects: 'المشاريع',
    favorites: 'المفضلة',
    addProperty: 'أضف عقارك',
    search: 'بحث',
    language: 'اللغة',
    arabic: 'العربية',
    english: 'English',
    back: 'عودة',
    share: 'مشاركة',
    all: 'الكل',

    // Currency & Metrics
    currency: 'ج.م',
    sqm: 'م²',
    perYear: 'سنوياً',
    perMonth: 'ج.م/شهر',
    month: 'شهر',
    years: 'سنوات',
    installment: 'قسط',

    // Badges & Status
    verified: 'موثق ومعتمد',
    seaView: 'إطلالة بحرية',
    developerBadge: 'عرض مطور مباشر',
    resaleBadge: 'بيع أفراد (إعادة بيع)',
    readyToDeliver: 'جاهز فوراً للتسليم',
    underConstruction: 'تحت الإنشاء',
    ready: 'جاهز فوراً',
    cashOnly: 'كاش فقط',
    cash: 'كاش',
    installments: 'تقسيط',
    expectedRoi: 'عائد إيجاري متوقع',

    // Financial
    downPayment: 'المقدم المطلوب',
    totalPrice: 'السعر الكلي',
    remainingInstallments: 'إجمالي الأقساط المتبقية',
    monthlyInstallment: 'القسط الشهري المعادل',
    installmentPlan: 'تفاصيل نظام السداد والأقساط',
    installmentsCount: 'عدد الأقساط',
    paymentFrequency: 'دورية السداد',
    cashDiscount: 'خصم كاش مميز',
    freqMonthly: 'شهري',
    freqQuarterly: 'ربع سنوي',
    freqSemiAnnual: 'نصف سنوي',
    freqAnnual: 'سنوي',

    // Specs
    area: 'المساحة',
    bedrooms: 'الغرف',
    bathrooms: 'الحمامات',
    delivery: 'الاستلام',
    governorate: 'المحافظة',
    roi: 'العائد الاستثماري',
    unitType: 'نوع الوحدة',
    description: 'الوصف والتفاصيل',
    photoGallery: 'معرض الصور',
    videos: 'الفيديوهات',
    projectDetails: 'تفاصيل المشروع',

    // Actions
    contactWhatsApp: 'واتساب',
    callPhone: 'اتصال',
    shareProperty: 'مشاركة',
    inquireNow: 'طلب التفاصيل والحجز',

    // Projects
    availableUnits: 'الوحدات المتاحة',
    noUnitsAvailable: 'لا توجد وحدات متاحة حالياً في هذا المشروع',
    projectOverview: 'نبذة عن المشروع',
    watchVideo: 'مشاهدة الفيديو التعريفي',
    noCoverImage: 'لا توجد صورة غلاف',

    // AI Search & Forms
    aiSearchTitle: 'البحث الذكي ومطابقة العقارات',
    aiSearchSubtitle: 'AI Search & Matching',
    aiStep1Title: 'بيانات التواصل والميزانية',
    aiStep2Title: 'البحث السريع أو اختيار المواصفات',
    aiStep: 'الخطوة',
    aiPromptPlaceholder: 'اكتب مواصفاتك، مثال: شاليه غرفتين في سهل حشيش على البحر...',
    aiLocationLabel: 'الموقع:',
    aiTypeAndBedsLabel: 'نوع الوحدة والغرف:',
    aiSeaViewDirect: '🌊 إطلالة بحرية مباشرة',
    aiStartMatching: 'بدء المطابقة الذكية بالـ AI',
    aiExtractedFilters: '💡 الفلاتر المستخرجة بالـ AI:',
    aiMatchingUnits: 'العقارات المتطابقة',
    aiNoMatches: 'لم نجد عقارات مطابقة، جرب تعديل الميزانية أو خيارات البحث.',
    aiMatchScore: 'تطابق',
    namePlaceholder: 'أحمد محمد',
    phonePlaceholder: '010xxxxxxxx',
    budgetLabel: 'الميزانية القصوى (ج.م)',
    budgetPlaceholder: 'مثال: 5000000',
    fullName: 'الاسم الكريم',
    phoneNumber: 'رقم الهاتف',
    view: 'عرض',
    errNameReq: 'يرجى إدخال اسمك الكريم (مطلوب).',
    errPhoneReq: 'يرجى إدخال رقم هاتف صحيح للتواصل (مطلوب).',
    errBudgetReq: 'يرجى إدخال الميزانية القصوى أو اختيار إحدى الميزانيات السريعة (مطلوب).',
    errSearchFail: 'تعذر استخراج التطابقات، يرجى التأكد من اتصال الإنترنت والمحاولة ثانية.',

    // Errors
    unitNotFound: 'الوحدة غير موجودة',
    projectNotFound: 'المشروع غير موجود',
    loading: 'جاري التحميل...',
  },

  en: {
    // Navigation & Common
    home: 'Home',
    units: 'Properties',
    projects: 'Projects',
    favorites: 'Favorites',
    addProperty: 'Add Property',
    search: 'Search',
    language: 'Language',
    arabic: 'العربية',
    english: 'English',
    back: 'Back',
    share: 'Share',
    all: 'All',

    // Currency & Metrics
    currency: 'EGP',
    sqm: 'm²',
    perYear: '/ year',
    perMonth: 'EGP/mo',
    month: 'month',
    years: 'years',
    installment: 'installment',

    // Badges & Status
    verified: 'Verified & Certified',
    seaView: 'Sea View',
    developerBadge: 'Direct Developer (0% Commission)',
    resaleBadge: 'Resale (Individual)',
    readyToDeliver: 'Ready for Immediate Delivery',
    underConstruction: 'Under Construction',
    ready: 'Ready Now',
    cashOnly: 'Cash Only',
    cash: 'Cash',
    installments: 'Installments',
    expectedRoi: 'Expected Rental ROI',

    // Financial
    downPayment: 'Down Payment Required',
    totalPrice: 'Total Price',
    remainingInstallments: 'Total Remaining Installments',
    monthlyInstallment: 'Monthly Equivalent Installment',
    installmentPlan: 'Payment Plan & Installments',
    installmentsCount: 'Number of Installments',
    paymentFrequency: 'Payment Frequency',
    cashDiscount: 'Cash Discount',
    freqMonthly: 'Monthly',
    freqQuarterly: 'Quarterly',
    freqSemiAnnual: 'Semi-Annual',
    freqAnnual: 'Annual',

    // Specs
    area: 'Area',
    bedrooms: 'Bedrooms',
    bathrooms: 'Bathrooms',
    delivery: 'Delivery',
    governorate: 'Governorate',
    roi: 'Expected ROI',
    unitType: 'Property Type',
    description: 'Description & Details',
    photoGallery: 'Photo Gallery',
    videos: 'Videos',
    projectDetails: 'Project Details',

    // Actions
    contactWhatsApp: 'WhatsApp',
    callPhone: 'Call',
    shareProperty: 'Share',
    inquireNow: 'Inquire & Book Now',

    // Projects
    availableUnits: 'Available Units',
    noUnitsAvailable: 'No units currently available in this project',
    projectOverview: 'Project Overview',
    watchVideo: 'Watch Promotional Video',
    noCoverImage: 'No cover image available',

    // AI Search & Forms
    aiSearchTitle: 'Smart Search & Property Matching',
    aiSearchSubtitle: 'AI Search & Matching',
    aiStep1Title: 'Contact Details & Budget',
    aiStep2Title: 'Quick Search or Pick Specs',
    aiStep: 'Step',
    aiPromptPlaceholder: 'Type your requirements, e.g., 2-bedroom chalet in Sahl Hasheesh on the sea...',
    aiLocationLabel: 'Location:',
    aiTypeAndBedsLabel: 'Property Type & Bedrooms:',
    aiSeaViewDirect: '🌊 Direct Sea View',
    aiStartMatching: 'Start Smart AI Matching',
    aiExtractedFilters: '💡 AI Extracted Filters:',
    aiMatchingUnits: 'Matching Properties',
    aiNoMatches: 'No matching properties found. Try adjusting your budget or search preferences.',
    aiMatchScore: 'Match',
    namePlaceholder: 'John Doe',
    phonePlaceholder: '+20 10xxxxxxxx',
    budgetLabel: 'Maximum Budget (EGP)',
    budgetPlaceholder: 'e.g. 5,000,000',
    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    view: 'View',
    errNameReq: 'Please enter your name (required).',
    errPhoneReq: 'Please enter a valid phone number (required).',
    errBudgetReq: 'Please enter your budget or select a quick budget option (required).',
    errSearchFail: 'Failed to extract matches. Please check your internet connection and try again.',

    // Errors
    unitNotFound: 'Property not found',
    projectNotFound: 'Project not found',
    loading: 'Loading...',
  }
};

export function getLocalized(item: any, field: string, lang: Language): string {
  if (!item) return '';

  const isEn = lang === 'en';

  if (field === 'title') {
    if (isEn) {
      return item.titleEn || item.title_en || item.title || '';
    }
    return item.titleAr || item.title_ar || item.title || '';
  }

  if (field === 'description') {
    if (isEn) {
      return item.descriptionEn || item.description_en || item.description || '';
    }
    return item.descriptionAr || item.description_ar || item.description || '';
  }

  if (field === 'name') {
    if (isEn) {
      return item.nameEn || item.name_en || item.name || '';
    }
    return item.nameAr || item.name_ar || item.name || '';
  }

  if (field === 'location') {
    const locObj = item.location;
    if (locObj && typeof locObj === 'object') {
      const locName = isEn 
        ? (locObj.nameEn || locObj.name_en || locObj.name)
        : (locObj.nameAr || locObj.name_ar || locObj.name);
      return locName || '';
    }
    if (isEn) {
      return item.locationEn || item.location_en || item.location || '';
    }
    return item.locationAr || item.location_ar || item.location || '';
  }

  return item[field] || '';
}
