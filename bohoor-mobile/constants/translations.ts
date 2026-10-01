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
    featuredProjects: '🌟 المشاريع المميزة',
    unitCount: 'وحدة',
    projectCount: 'مشروع',
    highRoi: 'عائد مرتفع',
    viewProject: 'عرض المشروع ←',
    tryDifferentSearch: 'جرب كلمة بحث مختلفة',
    availableUnits: 'الوحدات المتاحة',
    noUnitsAvailable: 'لا توجد وحدات متاحة حالياً في هذا المشروع',
    projectOverview: 'نبذة عن المشروع',
    watchVideo: 'مشاهدة الفيديو التعريفي',
    noCoverImage: 'لا توجد صورة غلاف',

    // Lead Form
    sendLeadTitle: 'عايز تلحق تحجز الفرصة ديه؟',
    sendLeadSub: 'سيب اسمك ورقم الواتساب، وفريقنا هيكلّمك يراجع معاك كل التفاصيل.',
    noBuyerCommission: '🎉 بدون أي عمولة من المشتري (0% عمولة)',
    developerDirectDesc: 'العقار معروض مباشرة من المطور العقاري وبنفس أسعار الشركة. لا توجد أي عمولات يتحملها المشتري.',
    resaleCommissionNotice: 'عمولة المنصة للمشتري: 1.25% ({commission} ج.م) تُدفع عند إتمام التنازل بنجاح. البائع لا يدفع أي عمولة.',
    leadSubmittedSuccess: 'تم استلام طلبك بنجاح!',
    leadSubmittedSub: 'سيقوم فريقنا بالتواصل معك في أقرب وقت.',
    submitting: 'جاري الإرسال...',
    confirmRequest: 'تأكيد الطلب',
    questionsLabel: 'إيه الأسئلة أو الاستفسارات التي تود معرفتها؟',


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

    // Favorites
    favoriteProperties: 'العقارات المفضلة ❤️',
    saveFavoriteHint: 'احفظ العقارات التي تعجبك بالضغط على أيقونة القلب لتصل إليها لاحقاً',
    noFavoritesTitle: 'لا توجد عقارات في المفضلة',
    noFavoritesSub: 'تصفح قائمة العقارات والمشاريع وقم بالضغط على رمز القلب لحفظ العقارات التي تهتم بها.',
    exploreProperties: 'استكشف العقارات الآن',
    roomsSuffix: 'غرف',
    savedCount: 'لديك {count} عقار محفوظ في قائمتك المفضلة',
    priceDownPayment: 'السعر / المقدم:',
    cashRequired: 'المطلوب كاش:',

    // Units Filter & Search
    searchPlaceholder: 'ابحث عن عقار، منطقة، مطور...',
    filterAll: 'الكل',
    filterCash: '💵 كاش',
    filterInstallment: '📅 تقسيط',
    filterDeveloper: '🏢 مطور',
    filterResale: '👤 إعادة بيع',
    resetFilters: 'إعادة ضبط',
    filtersAndResults: '{filters} فلاتر · {results} نتيجة',
    noMatchingUnits: 'لا توجد وحدات مطابقة',
    tryAdjustFilters: 'جرب تغيير الفلاتر أو توسيع نطاق البحث',
    clearAllFilters: 'إلغاء جميع الفلاتر',
    advancedFilter: 'تصفية متقدمة 🎯',
    clearAll: 'تفريغ الكل',
    seaViewOnly: '🌊 إطلالة بحرية فقط',
    seaViewSub: 'وحدات وشاليهات ساحلية',
    priceRange: 'نطاق السعر / المقدم (ج.م)',
    areaRange: 'المساحة (م²)',
    rangeMin: 'الأدنى',
    rangeMax: 'الأقصى',
    rangeNoLimit: 'بلا حد',
    rangeFromMin: 'من الأدنى',
    rangeM: 'م',
    governorateFilter: 'المحافظة',
    locationFilter: 'المنطقة',
    unitTypeFilter: 'نوع الوحدة',
    bedroomsFilter: 'عدد غرف النوم',
    developerFilter: 'المطور العقاري',
    showUnits: 'عرض {count} وحدة',
    commission: 'عمولة',
    beds: 'غرف',
    totalLabel: 'إجمالي:',
    searchProjectPlaceholder: 'ابحث عن مشروع، منطقة، مطور...',

    // Filters & Sorting
    sortByLabel: 'ترتيب حسب',
    sortNewest: 'الأحدث',
    sortPriceAsc: 'السعر: من الأقل للأعلى',
    sortPriceDesc: 'السعر: من الأعلى للأقل',
    sortRoiDesc: 'أعلى عائد استثماري (ROI)',
    sortInstallmentAsc: 'أقل قسط شهري',
    sortDownPaymentAsc: 'أقل مقدم',
    paymentSystemLabel: 'نظام السداد',
    cashOnlyOption: '💵 كاش فقط',
    installmentOption: '📅 تقسيط',
    allOptions: 'الكل',
    allGovernorates: 'جميع المحافظات',
    allAreas: 'جميع المناطق',
    allTypes: 'كل الأنواع',
    allDevelopers: 'جميع المطورين',
    bathroomsFilter: 'عدد الحمامات',
    monthlyInstallmentRange: 'القسط الشهري (ج.م)',
    cashOrDownRange: 'المبلغ الكاش / المقدم (ج.م)',
    minAreaPlaceholder: 'الأدنى م²',
    maxAreaPlaceholder: 'الأقصى م²',
    from: 'من',
    to: 'إلى',
    applyFilters: 'تطبيق الفلاتر',
    applyWithCount: 'تطبيق ({count} وحدة مطابقة)',
    seaViewDirectOnly: '🌊 إطلالة بحرية فقط',
    seaViewDirectSub: 'عرض الوحدات ذات الإطلالة الساحلية المباشرة',
    seeAll: 'عرض الكل',
    verifiedDeveloper: 'مطور معتمد',
    propertyCategories: 'التصنيفات العقارية',
    exploreByCategory: 'تصفح الوحدات المتاحة حسب النوع',
    latestDealsTitle: 'أحدث الفرص الاستثمارية',
    latestDealsSub: 'وحدات بعوائد مميزة وإعادة بيع مباشرة',
    featuredProjectsTitle: 'أبرز المشاريع العقارية',
    featuredProjectsSub: 'مشاريع فاخرة في أميز المواقع',
    topDevelopersTitle: 'المطورون المعتمدون',
    topDevelopersSub: 'نخبة المطورين العقاريين في مصر',
    aiAssistant: 'المساعد الذكي',
    aiSearchTitleHome: 'ابحث عن عقارك بالذكاء الاصطناعي ✨',
    aiSearchSubHome: 'حدد الميزانية والموقع وسنقترح لك الخيار الأنسب',
    expectedAnnualRent: '🏡 الإيجار السنوي المتوقع',
    propertyValueGrowth: '📈 نمو قيمة العقار',
    totalReturnRoi: '🚀 إجمالي العائد (Total ROI)',
    propertyPayback: '⏳ استرداد ثمن العقار',
    capitalGrowthCompound: 'توقعات نمو القيمة الرأسمالية التراكمية (العائد المركّب)',
    afterOneYear: 'بعد سنة (Year 1)',
    afterThreeYears: 'بعد 3 سنوات (Year 3)',
    afterFiveYears: 'بعد 5 سنوات (Year 5)',
    projectDetailsBtn: 'تفاصيل المشروع',
    directDeveloperBadge: '🏢 مطور مباشر (0% عمولة)',
    resaleIndividualBadge: '👤 بيع أفراد (إعادة بيع)',
    devDirectDesc: 'هذا العقار معروض مباشرة من شركة التطوير العقاري المعتمدة بدون رسوم إضافية.',
    fromPureCashRent: 'من الإيجار الكاش الصافي',
    yearsSuffix: 'سنوات',
    yearSuffix: 'سنة',
    cumulativeRent: 'إيجار تراكمي',
    rent: 'إيجار',

    // Add Property Form
    addPropertyTitle: 'أضف عقارك',
    step: 'الخطوة',
    personalInfoStep: 'البيانات الشخصية والاتفاقية',
    fullNameLabel: 'الاسم بالكامل',
    fullNamePlaceholder: 'اكتب اسمك',
    whatsappLabel: 'رقم الواتساب',
    whatsappPlaceholder: 'مثال: +201012345678',
    penaltyNotice: 'الشرط الجزائي: في حال أتمت المنصة بيع الوحدة وقررت أنت التراجع عن البيع، توافق على دفع شرط جزائي بقيمة 5000 جنيه مصري لإدارة المنصة تعويضاً عن وقت ومجهود الفريق.',
    agreePenalty: 'أوافق على الشرط الجزائي',
    unitDetailsStep: 'تفاصيل الوحدة',
    locationAreaLabel: 'الموقع / اسم المنطقة',
    locationPlaceholder: 'مثال: مدينتي، التجمع الخامس، الساحل الشمالي',
    unitTypeLabel: 'نوع الوحدة',
    unitTypePlaceholder: 'مثال: شقة، فيلا، شاليه، استوديو',
    areaLabel: 'المساحة (م²)',
    areaPlaceholder: 'مثال: 120',
    financialsStep: 'التفاصيل المالية',
    paymentMethod: 'طريقة الدفع',
    paymentCash: 'كاش',
    paymentInstallment: 'تقسيط',
    cashPriceRequired: 'السعر المطلوب كاش',
    downPaymentRequired: 'المقدم المطلوب منك كبائع (الأوفر + المدفوع)',
    amountPlaceholder: 'المبلغ بالجنيه المصري',
    remainingInstCount: 'عدد الأقساط المتبقية للمطور',
    instCountPlaceholder: 'مثال: 12',
    imagesStep: 'صور العقار',
    imagesTip: 'الصور الجيدة تسرّع من عملية البيع بشكل كبير.',
    pickImages: 'اختر الصور من الهاتف',
    nextStep: 'التالي',
    submitAndConfirm: 'تأكيد وإرسال',
    uploading: 'جاري الرفع...',
    alertTitle: 'تنبيه',
    alertError: 'خطأ',
    fillPersonalAndPenalty: 'يرجى إكمال البيانات والموافقة على الشرط الجزائي',
    fillUnitBasics: 'يرجى إكمال بيانات الوحدة الأساسية',
    fillAmount: 'يرجى تحديد المبلغ المطلوب',
    submitSuccessTitle: 'تم بنجاح!',
    submitSuccessMsg: 'تم إرسال طلبك بنجاح وسيتواصل معك فريق المنصة لمراجعة العقار وتفعيله.',
    submitErrorMsg: 'حدث خطأ أثناء رفع البيانات. حاول مرة أخرى.',
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
    featuredProjects: '🌟 Featured Projects',
    unitCount: 'units',
    projectCount: 'projects',
    highRoi: 'High ROI',
    viewProject: 'View Project →',
    tryDifferentSearch: 'Try a different search query',
    availableUnits: 'Available Units',
    noUnitsAvailable: 'No units currently available in this project',
    projectOverview: 'Project Overview',
    watchVideo: 'Watch Promotional Video',
    noCoverImage: 'No cover image available',

    // Lead Form
    sendLeadTitle: 'Want to grab this opportunity?',
    sendLeadSub: 'Leave your name and WhatsApp number, and our team will contact you with details.',
    noBuyerCommission: '🎉 0% Buyer Commission',
    developerDirectDesc: 'Directly listed from developer at official company prices. No buyer fees.',
    resaleCommissionNotice: 'Platform buyer commission: 1.25% ({commission} EGP) paid upon transfer completion. Seller pays 0%.',
    leadSubmittedSuccess: 'Request Received Successfully!',
    leadSubmittedSub: 'Our team will reach out to you shortly.',
    submitting: 'Submitting...',
    confirmRequest: 'Confirm Request',
    questionsLabel: 'Any questions or inquiries?',


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

    // Favorites
    favoriteProperties: 'Favorite Properties ❤️',
    saveFavoriteHint: 'Save properties you like by tapping the heart icon to view them later',
    noFavoritesTitle: 'No Saved Properties',
    noFavoritesSub: 'Browse properties and projects and tap the heart icon to save the ones you love.',
    exploreProperties: 'Explore Properties Now',
    roomsSuffix: 'rooms',
    savedCount: 'You have {count} saved properties in your wishlist',
    priceDownPayment: 'Price / Down Payment:',
    cashRequired: 'Cash Required:',

    // Units Filter & Search
    searchPlaceholder: 'Search properties, location, developer...',
    filterAll: 'All',
    filterCash: '💵 Cash',
    filterInstallment: '📅 Installments',
    filterDeveloper: '🏢 Developer',
    filterResale: '👤 Resale',
    resetFilters: 'Reset',
    filtersAndResults: '{filters} filters · {results} results',
    noMatchingUnits: 'No Matching Properties',
    tryAdjustFilters: 'Try adjusting your filters or search keywords',
    clearAllFilters: 'Clear All Filters',
    advancedFilter: 'Advanced Filter 🎯',
    clearAll: 'Clear All',
    seaViewOnly: '🌊 Sea View Only',
    seaViewSub: 'Coastal units & chalets',
    priceRange: 'Price / Down Payment Range (EGP)',
    areaRange: 'Area (m²)',
    rangeMin: 'Min',
    rangeMax: 'Max',
    rangeNoLimit: 'No Limit',
    rangeFromMin: 'From Min',
    rangeM: 'M',
    governorateFilter: 'Governorate',
    locationFilter: 'Location',
    unitTypeFilter: 'Property Type',
    bedroomsFilter: 'Bedrooms',
    developerFilter: 'Developer',
    showUnits: 'Show {count} units',
    commission: 'Comm',
    beds: 'beds',
    totalLabel: 'Total:',
    searchProjectPlaceholder: 'Search project, area, developer...',

    // Filters & Sorting
    sortByLabel: 'Sort By',
    sortNewest: 'Newest',
    sortPriceAsc: 'Price: Low to High',
    sortPriceDesc: 'Price: High to Low',
    sortRoiDesc: 'Highest ROI',
    sortInstallmentAsc: 'Lowest Monthly Installment',
    sortDownPaymentAsc: 'Lowest Down Payment',
    paymentSystemLabel: 'Payment System',
    cashOnlyOption: '💵 Cash Only',
    installmentOption: '📅 Installments',
    allOptions: 'All',
    allGovernorates: 'All Governorates',
    allAreas: 'All Areas',
    allTypes: 'All Types',
    allDevelopers: 'All Developers',
    bathroomsFilter: 'Bathrooms',
    monthlyInstallmentRange: 'Monthly Installment (EGP)',
    cashOrDownRange: 'Cash / Down Payment (EGP)',
    minAreaPlaceholder: 'Min m²',
    maxAreaPlaceholder: 'Max m²',
    from: 'From',
    to: 'To',
    applyFilters: 'Apply Filters',
    applyWithCount: 'Apply ({count} matching units)',
    seaViewDirectOnly: '🌊 Sea View Only',
    seaViewDirectSub: 'Show coastal and sea view units only',
    seeAll: 'See All',
    verifiedDeveloper: 'Verified Developer',
    propertyCategories: 'Property Categories',
    exploreByCategory: 'Explore properties by category',
    latestDealsTitle: 'Latest Investment Deals',
    latestDealsSub: 'Prime units with attractive rental yields',
    featuredProjectsTitle: 'Featured Real Estate Projects',
    featuredProjectsSub: 'Luxury developments in prime locations',
    topDevelopersTitle: 'Top Verified Developers',
    topDevelopersSub: 'Leading real estate developers in Egypt',
    aiAssistant: 'AI Assistant',
    aiSearchTitleHome: 'AI Property Search & Match ✨',
    aiSearchSubHome: 'Set budget & location for instant AI recommendations',
    expectedAnnualRent: '🏡 Expected Annual Rent',
    propertyValueGrowth: '📈 Property Value Growth',
    totalReturnRoi: '🚀 Total Return (Total ROI)',
    propertyPayback: '⏳ Property Payback Period',
    capitalGrowthCompound: 'Cumulative Capital Growth Expectations (Compound Return)',
    afterOneYear: 'After 1 Year (Year 1)',
    afterThreeYears: 'After 3 Years (Year 3)',
    afterFiveYears: 'After 5 Years (Year 5)',
    projectDetailsBtn: 'Project Details',
    directDeveloperBadge: '🏢 Direct Developer (0% Commission)',
    resaleIndividualBadge: '👤 Individual Sale (Resale)',
    devDirectDesc: 'This property is offered directly by the certified developer without extra fees.',
    fromPureCashRent: 'From Pure Cash Rent',
    yearsSuffix: 'years',
    yearSuffix: 'year',
    cumulativeRent: 'Cumulative rent',
    rent: 'Rent',

    // Add Property Form
    addPropertyTitle: 'Add Property',
    step: 'Step',
    personalInfoStep: 'Personal Info & Agreement',
    fullNameLabel: 'Full Name',
    fullNamePlaceholder: 'Enter your full name',
    whatsappLabel: 'WhatsApp Number',
    whatsappPlaceholder: 'e.g. +201012345678',
    penaltyNotice: 'Penalty Clause: If the platform completes the sale of the property and you decide to withdraw, you agree to pay a 5,000 EGP cancellation fee compensating the team for their efforts.',
    agreePenalty: 'I agree to the penalty clause',
    unitDetailsStep: 'Unit Details',
    locationAreaLabel: 'Location / Area Name',
    locationPlaceholder: 'e.g. Madinaty, New Cairo, North Coast',
    unitTypeLabel: 'Property Type',
    unitTypePlaceholder: 'e.g. Apartment, Villa, Chalet, Studio',
    areaLabel: 'Area (m²)',
    areaPlaceholder: 'e.g. 120',
    financialsStep: 'Financial Details',
    paymentMethod: 'Payment Method',
    paymentCash: 'Cash',
    paymentInstallment: 'Installments',
    cashPriceRequired: 'Cash Price Required',
    downPaymentRequired: 'Down Payment Required (Over + Paid)',
    amountPlaceholder: 'Amount in EGP',
    remainingInstCount: 'Remaining Installments to Developer',
    instCountPlaceholder: 'e.g. 12',
    imagesStep: 'Property Images',
    imagesTip: 'Good photos significantly speed up the selling process.',
    pickImages: 'Choose Images from Phone',
    nextStep: 'Next',
    submitAndConfirm: 'Confirm & Submit',
    uploading: 'Uploading...',
    alertTitle: 'Notice',
    alertError: 'Error',
    fillPersonalAndPenalty: 'Please complete your info and agree to the penalty clause',
    fillUnitBasics: 'Please complete the basic unit details',
    fillAmount: 'Please specify the required amount',
    submitSuccessTitle: 'Success!',
    submitSuccessMsg: 'Your request has been submitted. Our team will contact you to review and activate the property.',
    submitErrorMsg: 'An error occurred while uploading. Please try again.',
  }
};

const AR_TO_EN_MAP: Record<string, string> = {
  'شاليهات': 'Chalets',
  'شاليه': 'Chalet',
  'شقق': 'Apartments',
  'شقة': 'Apartment',
  'فلل': 'Villas',
  'فيلا': 'Villa',
  'دوبلكس': 'Duplex',
  'تجاري': 'Commercial',
  'سهل حشيش': 'Sahl Hasheesh',
  'الجونة': 'El Gouna',
  'الساحل الشمالي': 'North Coast',
  'الساحل': 'North Coast',
  'الغردقة': 'Hurghada',
  'التجمع الخامس': 'New Cairo',
  'التجمع': 'New Cairo',
  'الشيخ زايد': 'Sheikh Zayed',
  'زايد': 'Sheikh Zayed',
  'البحر الأحمر': 'Red Sea',
  'القاهرة': 'Cairo',
  'الجيزة': 'Giza',
  'مطروح': 'Matrouh',
  'الإسكندرية': 'Alexandria',
  'السويس': 'Suez',
  'جنوب سيناء': 'South Sinai',
  'إطلالة بحرية': 'Sea View',
  'صف أول': 'Frontline',
  'صف تاني': 'Second Line',
  'على البحر': 'On Sea',
  'بحر': 'Sea',
  'موقع مميز': 'Prime Location',
  'جاهز فوراً': 'Ready to Deliver',
  'تحت الإنشاء': 'Under Construction',
  'غرف': 'rooms',
  'غرفة': 'room',
  'حمام': 'bath',
};

export function autoTranslateArabicToEnglish(text: string): string {
  if (!text || typeof text !== 'string') return '';
  let result = text;
  Object.keys(AR_TO_EN_MAP).forEach((arKey) => {
    if (result.includes(arKey)) {
      result = result.replace(new RegExp(arKey, 'g'), AR_TO_EN_MAP[arKey]);
    }
  });
  return result;
}

export function getLocalized(item: any, field: string, lang: Language): string {
  if (!item) return '';

  const isEn = lang === 'en';

  if (field === 'title') {
    if (isEn) {
      const enVal = item.titleEn || item.title_en;
      if (enVal) return enVal;
      return autoTranslateArabicToEnglish(item.titleAr || item.title_ar || item.title || '');
    }
    return item.titleAr || item.title_ar || item.title || '';
  }

  if (field === 'description') {
    if (isEn) {
      const enVal = item.descriptionEn || item.description_en;
      if (enVal) return enVal;
      return autoTranslateArabicToEnglish(item.descriptionAr || item.description_ar || item.description || '');
    }
    return item.descriptionAr || item.description_ar || item.description || '';
  }

  if (field === 'name') {
    if (isEn) {
      const enVal = item.nameEn || item.name_en;
      if (enVal) return enVal;
      return autoTranslateArabicToEnglish(item.nameAr || item.name_ar || item.name || '');
    }
    return item.nameAr || item.name_ar || item.name || '';
  }

  if (field === 'location') {
    const locObj = item.location;
    if (locObj && typeof locObj === 'object') {
      const locName = isEn 
        ? (locObj.nameEn || locObj.name_en || autoTranslateArabicToEnglish(locObj.nameAr || locObj.name_ar || locObj.name))
        : (locObj.nameAr || locObj.name_ar || locObj.name);
      return locName || '';
    }
    if (isEn) {
      const enLoc = item.locationEn || item.location_en;
      if (enLoc) return enLoc;
      return autoTranslateArabicToEnglish(item.locationAr || item.location_ar || item.location || '');
    }
    return item.locationAr || item.location_ar || item.location || '';
  }

  if (field === 'unitType') {
    const typeObj = item.unitType;
    if (typeObj && typeof typeObj === 'object') {
      const typeName = isEn
        ? (typeObj.nameEn || typeObj.name_en || autoTranslateArabicToEnglish(typeObj.nameAr || typeObj.name_ar || typeObj.name))
        : (typeObj.nameAr || typeObj.name_ar || typeObj.name);
      return typeName || '';
    }
    if (isEn) {
      const enType = item.unitTypeEn || item.unitType_en;
      if (enType) return enType;
      return autoTranslateArabicToEnglish(item.unitTypeAr || item.unitType_ar || (typeof item.unitType === 'string' ? item.unitType : ''));
    }
    return item.unitTypeAr || item.unitType_ar || (typeof item.unitType === 'string' ? item.unitType : '');
  }

  const val = item[field];
  if (val && typeof val === 'object') {
    return val.nameAr || val.nameEn || val.name || val.titleAr || val.titleEn || val.title || '';
  }

  const strVal = (val !== undefined && val !== null) ? String(val) : '';
  return isEn ? autoTranslateArabicToEnglish(strVal) : strVal;
}

export const GOVERNORATE_NAMES: Record<string, { ar: string; en: string }> = {
  'البحر الأحمر': { ar: 'البحر الأحمر', en: 'Red Sea' },
  'القاهرة': { ar: 'القاهرة', en: 'Cairo' },
  'الجيزة': { ar: 'الجيزة', en: 'Giza' },
  'مطروح': { ar: 'مطروح', en: 'Matrouh' },
  'الإسكندرية': { ar: 'الإسكندرية', en: 'Alexandria' },
  'السويس': { ar: 'السويس', en: 'Suez' },
  'جنوب سيناء': { ar: 'جنوب سيناء', en: 'South Sinai' },
  'شمال سيناء': { ar: 'شمال سيناء', en: 'North Sinai' },
};

export function getGovernorateLabel(gov: string, lang: 'ar' | 'en'): string {
  if (!gov) return '';
  const entry = GOVERNORATE_NAMES[gov];
  if (entry) {
    return lang === 'en' ? entry.en : entry.ar;
  }
  return gov;
}

