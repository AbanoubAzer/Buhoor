export type Language = 'ar' | 'en';

export const translations = {
  ar: {
    // Header & Navigation
    home: 'الرئيسية',
    units: 'العقارات',
    projects: 'المشاريع',
    areas: 'المناطق',
    developers: 'المطورين',
    addProperty: 'أضف عقارك مجاناً',
    favorites: 'المفضلة',
    language: 'اللغة',
    arabic: 'العربية',
    english: 'English',
    trustTitle1: 'دعم وخدمة مميزة',
    trustTitle2: 'تجربة آمنة وسهلة',
    trustTitle3: 'بيانات فعالة ومؤمنة',
    
    // Currency & Units
    currency: 'ج.م',
    sqm: 'م²',
    perYear: 'سنوياً',
    perMonth: 'شهرياً',
    month: 'شهر',
    years: 'سنوات',
    installment: 'قسط',

    // Badges & Statuses
    verified: 'موثق ومعتمد',
    seaView: 'إطلالة بحرية',
    directDeveloper: 'عرض مطور مباشر (0% عمولة)',
    resale: 'بيع أفراد (إعادة بيع)',
    developerTag: 'مطور',
    resaleTag: 'أفراد',
    readyToDeliver: 'جاهز فوراً للتسليم',
    underConstruction: 'تحت الإنشاء',
    ready: 'جاهز فوراً',
    cashOnly: 'كاش فقط',
    cash: 'كاش',
    installments: 'تقسيط',
    expectedRoi: 'عائد إيجاري متوقع',

    // Pricing & Financial Breakdown
    downPayment: 'المقدم المطلوب',
    totalPrice: 'السعر الكلي',
    cashPaidToSeller: 'المقدم / الكاش المطلوب',
    originalContractPrice: 'سعر العقد الأصلي',
    remainingInstallments: 'إجمالي الأقساط المتبقية',
    monthlyInstallment: 'القسط الشهري المعادل',
    installmentPlan: 'تفاصيل نظام السداد والأقساط',
    installmentsCount: 'عدد الأقساط',
    paymentFrequency: 'دورية السداد',
    cashDiscount: 'خصم الدفع الكاش',
    discount: 'خصم',
    priceOnDemand: 'السعر عند الطلب',

    // Frequency
    freqMonthly: 'شهري',
    freqQuarterly: 'ربع سنوي',
    freqSemiAnnual: 'نصف سنوي',
    freqAnnual: 'سنوي',

    // Specifications
    specifications: 'المواصفات الأساسية',
    area: 'المساحة الكلية',
    unitType: 'نوع الوحدة',
    bedrooms: 'غرف النوم',
    bathrooms: 'الحمامات',
    view: 'الإطلالة',
    directSeaView: 'على البحر مباشرة',
    delivery: 'التسليم',
    governorate: 'المحافظة',
    roi: 'العائد الاستثماري',
    floor: 'الدور',

    // Details & Media
    descriptionAndDetails: 'الوصف والتفاصيل',
    photoGallery: 'معرض الصور',
    otherPhotos: 'باقي الصور',
    videos: 'الفيديوهات',
    developer: 'المطور العقاري',
    project: 'المشروع السكني',
    viewProjectDetails: 'تفاصيل المشروع',

    // Actions & Buttons
    shareProperty: 'مشاركة العقار',
    shareProject: 'مشاركة المشروع',
    shareUnitNow: 'مشاركة الوحدة الآن',
    shareModalTitle: 'مشاركة الرابط',
    shareModalSub: 'شارك العقار عبر التطبيقات أو انسخ الرابط',
    copyLink: 'نسخ رابط المشاركة',
    copy: 'نسخ',
    copied: 'تم النسخ بنجاح!',
    whatsApp: 'واتساب',
    facebook: 'فيسبوك',
    sms: 'رسائل SMS',
    twitter: 'إكس (تويتر)',
    openInApp: 'فتح في تطبيق بُحور',
    openInAppSub: 'للأجهزة المحمولة المثبت عليها التطبيق',
    openAppBtn: 'فتح التطبيق',
    appBannerTitle: 'تطبيق بُحور متاح لهاتفك',
    appBannerSub: 'تصفح العقار بتجربة أسرع وسلسة',
    contactWhatsApp: 'تواصل عبر واتساب',
    callNow: 'اتصال هاتفياً',
    contactAdvisor: 'طلب تفاصيل العقار',

    // Lead Form
    leadFormTitle: 'مهتم بهذا العقار؟',
    leadFormSub: 'اترك بياناتك وسيتواصل معك مستشارك العقاري فوراً عبر الهاتف أو واتساب',
    fullName: 'الاسم بالكامل',
    namePlaceholder: 'أحمد محمود',
    phoneNumber: 'رقم الهاتف',
    phonePlaceholder: '01000000000',
    notes: 'ملاحظات إضافية (اختياري)',
    notesPlaceholder: 'استفسار عن موعد المعاينة أو خطة السداد...',
    submitInquiry: 'إرسال طلب التواصل',
    submitting: 'جاري الإرسال...',
    leadSuccessTitle: 'تم إرسال طلبك بنجاح!',
    leadSuccessSub: 'سيتواصل معك أحد مستشارينا العقاريين في أقرب وقت.',
    leadError: 'حدث خطأ أثناء الإرسال، برجاء المحاولة مرة أخرى.',

    // Filters & Search
    filters: 'تصفية العقارات',
    searchPlaceholder: 'ابحث باسم العقار، المنطقة، أو المطور...',
    locationFilter: 'الموقع أو المحافظة',
    allLocations: 'كل المناطق',
    unitTypeFilter: 'نوع الوحدة',
    allTypes: 'كل الأنواع',
    sellerFilter: 'نوع العرض',
    allSellers: 'الكل (مطور وأفراد)',
    developerDirect: 'مطور مباشر',
    resaleOnly: 'إعادة بيع (أفراد)',
    paymentTypeFilter: 'نظام الدفع',
    allPayment: 'الكل (كاش وتقسيط)',
    cashOnlyFilter: 'كاش فقط',
    installmentsFilter: 'تقسيط متاح',
    priceFilter: 'نطاق السعر المطلوب',
    minPrice: 'الحد الأدنى',
    maxPrice: 'الحد الأقصى',
    bedroomsCount: 'عدد الغرف',
    any: 'الكل',
    seaViewOnly: 'إطلالة بحرية فقط',
    applyFilters: 'تطبيق التصفية',
    resetFilters: 'إعادة ضبط',
    sortBy: 'ترتيب حسب',
    sortNewest: 'الأحدث أولاً',
    sortPriceAsc: 'السعر: من الأقل للأعلى',
    sortPriceDesc: 'السعر: من الأعلى للأقل',
    sortRoiDesc: 'الأعلى عائداً استثمارياً',
    noUnitsFound: 'لم يتم العثور على وحدات مطابقة لبحثك.',
    clearFilters: 'إلغاء جميع الفلاتر',
    availableUnitsInProject: 'الوحدات المتاحة في المشروع',
    noUnitsInProject: 'لا توجد وحدات متاحة للبيع في هذا المشروع حالياً.',
    viewDetails: 'التفاصيل',

    // AI Search
    aiSearchBtn: 'البحث بالذكاء الاصطناعي',
    aiSearchTitle: 'البحث الذكي باللغة الطبيعية',
    aiSearchSub: 'اكتب ما تبحث عنه بالعامية أو الفصحى مثل: "شاليه في الجونة جاهز للتسليم في حدود 8 مليون"',
    aiInputPlaceholder: 'اكتب مواصفات عقارك المطلوب هنا...',
    aiStartSearch: 'ابحث بالذكاء الاصطناعي',
    aiSearching: 'جاري البحث والتحليل بالذكاء الاصطناعي...',
    aiMatchedUnits: 'عقارات تم مطابقتها لطلبك',
    aiNoMatches: 'لم نجد عقارات مطابقة تماماً لمواصفاتك، جرب تغيير السعر أو المنطقة.',
    aiMatchConfidence: 'نسبة التطابق:',
    aiReasoning: 'سبب الترشيح:',

    // Errors & Not Found
    notFoundTitle: 'العنصر غير موجود',
    notFoundDesc: 'لم يتم العثور على الصفحة أو العقار المطلوب.',
    backHome: 'العودة للرئيسية',
    errorOccurred: 'حدث خطأ غير متوقع',
    tryAgain: 'إعادة المحاولة',

    // Favorites Page
    favoriteProperties: 'العقارات المفضلة',
    favoritesPageSub: 'جميع الوحدات والعقارات التي قمت بحفظها للرجوع إليها لاحقاً تظهر هنا.',
    noFavoritesTitle: 'لا توجد عقارات في المفضلة',
    noFavoritesSub: 'قم بتصفح العقارات المتاحة واضغط على علامة القلب (❤️) لحفظ العقارات التي تنال إعجابك للرجوع لها بسرعة في أي وقت.',
    browseUnitsNow: 'تصفح العقارات الآن',
  },

  en: {
    // Header & Navigation
    home: 'Home',
    units: 'Properties',
    projects: 'Projects',
    areas: 'Areas',
    developers: 'Developers',
    addProperty: 'List Property Free',
    favorites: 'Favorites',
    language: 'Language',
    arabic: 'العربية',
    english: 'English',
    trustTitle1: 'Premium Support & Service',
    trustTitle2: 'Safe & Seamless Experience',
    trustTitle3: 'Verified & Secure Data',

    // Currency & Units
    currency: 'EGP',
    sqm: 'm²',
    perYear: '/ year',
    perMonth: '/ month',
    month: 'month',
    years: 'years',
    installment: 'installment',

    // Badges & Statuses
    verified: 'Verified & Certified',
    seaView: 'Direct Sea View',
    directDeveloper: 'Direct Developer (0% Commission)',
    resale: 'Resale (Individual)',
    developerTag: 'Developer',
    resaleTag: 'Resale',
    readyToDeliver: 'Ready for Immediate Delivery',
    underConstruction: 'Under Construction',
    ready: 'Ready Now',
    cashOnly: 'Cash Only',
    cash: 'Cash',
    installments: 'Installments',
    expectedRoi: 'Expected Rental ROI',

    // Pricing & Financial Breakdown
    downPayment: 'Required Down Payment',
    totalPrice: 'Total Price',
    cashPaidToSeller: 'Down Payment / Cash Required',
    originalContractPrice: 'Original Contract Price',
    remainingInstallments: 'Total Remaining Installments',
    monthlyInstallment: 'Equivalent Monthly Installment',
    installmentPlan: 'Payment Plan & Installments Breakdown',
    installmentsCount: 'Number of Installments',
    paymentFrequency: 'Payment Frequency',
    cashDiscount: 'Cash Discount',
    discount: 'Discount',
    priceOnDemand: 'Price upon request',

    // Frequency
    freqMonthly: 'Monthly',
    freqQuarterly: 'Quarterly',
    freqSemiAnnual: 'Semi-Annual',
    freqAnnual: 'Annual',

    // Specifications
    specifications: 'Key Specifications',
    area: 'Total Area',
    unitType: 'Property Type',
    bedrooms: 'Bedrooms',
    bathrooms: 'Bathrooms',
    view: 'View',
    directSeaView: 'Direct Sea View',
    delivery: 'Delivery',
    governorate: 'Governorate',
    roi: 'Investment ROI',
    floor: 'Floor',

    // Details & Media
    descriptionAndDetails: 'Description & Details',
    photoGallery: 'Photo Gallery',
    otherPhotos: 'More Photos',
    videos: 'Videos',
    developer: 'Real Estate Developer',
    project: 'Residential Project',
    viewProjectDetails: 'Project Details',

    // Actions & Buttons
    shareProperty: 'Share Property',
    shareProject: 'Share Project',
    shareUnitNow: 'Share Property Now',
    shareModalTitle: 'Share Link',
    shareModalSub: 'Share property via apps or copy direct link',
    copyLink: 'Copy Share Link',
    copy: 'Copy',
    copied: 'Copied successfully!',
    whatsApp: 'WhatsApp',
    facebook: 'Facebook',
    sms: 'SMS Messages',
    twitter: 'X (Twitter)',
    openInApp: 'Open in Bohoor App',
    openInAppSub: 'For mobile devices with app installed',
    openAppBtn: 'Open App',
    appBannerTitle: 'Bohoor App is available',
    appBannerSub: 'Browse properties with a faster experience',
    contactWhatsApp: 'Contact on WhatsApp',
    callNow: 'Call Phone',
    contactAdvisor: 'Inquire About Property',

    // Lead Form
    leadFormTitle: 'Interested in this property?',
    leadFormSub: 'Leave your details and a property advisor will contact you immediately via phone or WhatsApp',
    fullName: 'Full Name',
    namePlaceholder: 'Ahmed Mahmoud',
    phoneNumber: 'Phone Number',
    phonePlaceholder: '01000000000',
    notes: 'Additional Notes (Optional)',
    notesPlaceholder: 'Inquiring about visit schedule or installment options...',
    submitInquiry: 'Send Inquiry',
    submitting: 'Sending...',
    leadSuccessTitle: 'Request sent successfully!',
    leadSuccessSub: 'One of our real estate advisors will reach out to you shortly.',
    leadError: 'An error occurred while sending. Please try again.',

    // Filters & Search
    filters: 'Filter Properties',
    searchPlaceholder: 'Search by property title, area, or developer...',
    locationFilter: 'Location or Governorate',
    allLocations: 'All Locations',
    unitTypeFilter: 'Property Type',
    allTypes: 'All Types',
    sellerFilter: 'Listing Type',
    allSellers: 'All (Developer & Resale)',
    developerDirect: 'Direct Developer',
    resaleOnly: 'Resale Only',
    paymentTypeFilter: 'Payment Terms',
    allPayment: 'All (Cash & Installments)',
    cashOnlyFilter: 'Cash Only',
    installmentsFilter: 'Installments Available',
    priceFilter: 'Target Price Range',
    minPrice: 'Min Price',
    maxPrice: 'Max Price',
    bedroomsCount: 'Bedrooms',
    any: 'Any',
    seaViewOnly: 'Sea View Only',
    applyFilters: 'Apply Filters',
    resetFilters: 'Reset',
    sortBy: 'Sort By',
    sortNewest: 'Newest First',
    sortPriceAsc: 'Price: Low to High',
    sortPriceDesc: 'Price: High to Low',
    sortRoiDesc: 'Highest Investment ROI',
    noUnitsFound: 'No properties matched your search criteria.',
    clearFilters: 'Clear All Filters',
    availableUnitsInProject: 'Available Units in Project',
    noUnitsInProject: 'No units currently available in this project.',
    viewDetails: 'Details',

    // AI Search
    aiSearchBtn: 'AI Smart Search',
    aiSearchTitle: 'Natural Language AI Search',
    aiSearchSub: 'Type what you are looking for in natural language, e.g. "Chalet in El Gouna ready now under 8 million"',
    aiInputPlaceholder: 'Type your property criteria here...',
    aiStartSearch: 'Search with AI',
    aiSearching: 'Searching and analyzing with AI...',
    aiMatchedUnits: 'Properties matched for your request',
    aiNoMatches: 'No properties matched your criteria. Try adjusting price or location.',
    aiMatchConfidence: 'Match Score:',
    aiReasoning: 'Why this was picked:',

    // Errors & Not Found
    notFoundTitle: 'Item Not Found',
    notFoundDesc: 'The page or property requested could not be found.',
    backHome: 'Back to Home',
    errorOccurred: 'An unexpected error occurred',
    tryAgain: 'Try Again',

    // Favorites Page
    favoriteProperties: 'Favorite Properties',
    favoritesPageSub: 'All properties and units you have saved for later reference appear here.',
    noFavoritesTitle: 'No Saved Properties',
    noFavoritesSub: 'Browse available properties and tap the heart icon (❤️) to save your favorites for quick access anytime.',
    browseUnitsNow: 'Browse Properties Now',
  }
};

/**
 * Resolves localized fields from an entity with fallback logic:
 * Checks titleEn / titleAr, descriptionEn / descriptionAr, nameEn / nameAr, etc.
 */
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
      const govName = isEn
        ? (locObj.governorateEn || locObj.governorate_en || locObj.governorate)
        : (locObj.governorateAr || locObj.governorate_ar || locObj.governorate);

      if (govName && locName && govName !== locName) {
        return `${locName}, ${govName}`;
      }
      return locName || govName || '';
    }
    if (isEn) {
      return item.locationEn || item.location_en || item.location || '';
    }
    return item.locationAr || item.location_ar || item.location || '';
  }

  if (field === 'governorate') {
    const locObj = item.location;
    if (locObj && typeof locObj === 'object') {
      return isEn 
        ? (locObj.governorateEn || locObj.governorate_en || locObj.governorate || '')
        : (locObj.governorateAr || locObj.governorate_ar || locObj.governorate || '');
    }
    return isEn 
      ? (item.governorateEn || item.governorate_en || item.governorate || '')
      : (item.governorateAr || item.governorate_ar || item.governorate || '');
  }

  if (field === 'unitType') {
    const typeObj = item.unitType;
    if (typeObj && typeof typeObj === 'object') {
      return isEn
        ? (typeObj.nameEn || typeObj.name_en || typeObj.name || '')
        : (typeObj.nameAr || typeObj.name_ar || typeObj.name || '');
    }
    return isEn
      ? (item.unitTypeEn || item.unitType_en || item.unitType || '')
      : (item.unitTypeAr || item.unitType_ar || item.unitType || '');
  }

  return item[field] || '';
}
