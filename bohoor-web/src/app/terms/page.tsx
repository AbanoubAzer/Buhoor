import { Metadata } from 'next';
import Link from 'next/link';
import { 
  ScaleIcon, 
  DocumentCheckIcon, 
  ExclamationTriangleIcon, 
  BuildingOffice2Icon,
  BanknotesIcon,
  ChevronLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  ListBulletIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'الشروط والأحكام | منصة بحور العقارية',
  description: 'تعرف على الشروط والأحكام الحاكمة لاستخدام منصة بحور العقارية، وضوابط عرض العقارات، وإخلاء المسؤولية الاستثمارية والمالية.',
};

export default function TermsAndConditionsPage() {
  const lastUpdated = '23 سبتمبر 2026';

  const sections = [
    { id: 'acceptance', title: '1. قبول الشروط والأحكام' },
    { id: 'role', title: '2. طبيعة دور منصة بحور' },
    { id: 'investment-disclaimer', title: '3. إخلاء مسؤولية حاسبات العائد (ROI)' },
    { id: 'listing-rules', title: '4. ضوابط إضافة العقارات والإعلانات' },
    { id: 'user-obligations', title: '5. التزامات المستخدم والمشتري' },
    { id: 'intellectual-property', title: '6. حقوق الملكية الفكرية' },
    { id: 'limitation-liability', title: '7. حدود المسؤولية القانونية' },
    { id: 'governing-law', title: '8. القانون الواجب التطبيق والنزاعات' },
    { id: 'modifications', title: '9. تعديل الشروط والتواصل' },
  ];

  return (
    <div className="min-h-screen bg-gray-50/60 pb-16 sm:pb-20 break-words overflow-x-hidden">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0c1b37] via-[#152D5B] to-[#1a3870] text-white py-10 sm:py-14 lg:py-20">
        <div className="absolute inset-0 opacity-10 pattern-dots pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-72 sm:w-96 h-72 sm:h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 sm:w-96 h-72 sm:h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-300 mb-4 sm:mb-6">
            <Link href="/" className="hover:text-accent transition">الرئيسية</Link>
            <ChevronLeftIcon className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-white font-semibold">الشروط والأحكام</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-semibold text-accent border border-white/10 mb-3 sm:mb-4">
                <ScaleIcon className="w-4 h-4" />
                <span>الاتفاقية والضوابط القانونية</span>
              </span>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-cairo tracking-tight leading-tight">
                الشروط والأحكام
              </h1>
              <p className="mt-2 sm:mt-3 text-sm sm:text-base md:text-lg text-gray-200 max-w-2xl font-light">
                تنظم هذه الاتفاقية استخدامك لمنصة بحور العقارية وضوابط التعامل والتسويق العقاري والاستثماري.
              </p>
            </div>

            <div className="self-start sm:self-auto bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-2 sm:px-4 sm:py-3 rounded-2xl text-xs text-gray-200 shrink-0">
              <span className="block text-gray-300 text-[11px]">آخر تحديث:</span>
              <span className="font-bold text-white text-xs sm:text-sm">{lastUpdated}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        
        {/* Mobile Quick Jump Bar (Visible only on < lg) */}
        <div className="lg:hidden mb-6">
          <details className="group bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-sm text-gray-800 font-cairo select-none">
              <span className="flex items-center gap-2 text-primary">
                <ListBulletIcon className="w-5 h-5 text-primary" />
                <span>فهرس بنود الاتفاقية (انتقل سريعاً)</span>
              </span>
              <span className="text-xs text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-3 pt-0 border-t border-gray-100 bg-gray-50/50">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs font-semibold text-gray-700 py-2">
                {sections.map((sec) => (
                  <li key={sec.id}>
                    <a 
                      href={`#${sec.id}`}
                      className="block p-2 rounded-xl bg-white border border-gray-100 hover:bg-primary/5 hover:text-primary transition"
                    >
                      {sec.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Sticky Sidebar Navigation (Visible on lg+) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-5">
            <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs">
              <h2 className="text-sm font-bold text-gray-900 mb-4 font-cairo flex items-center gap-2">
                <DocumentCheckIcon className="w-4 h-4 text-primary" />
                <span>فهرس بنود الاتفاقية</span>
              </h2>
              <ul className="space-y-1.5 text-xs font-semibold text-gray-600">
                {sections.map((sec) => (
                  <li key={sec.id}>
                    <a 
                      href={`#${sec.id}`}
                      className="block p-2 rounded-xl hover:bg-primary/5 hover:text-primary transition"
                    >
                      {sec.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Crucial Notice Badge */}
            <div className="bg-amber-500/10 border border-amber-300/80 p-5 rounded-3xl space-y-2 text-amber-950">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs font-cairo">
                <ExclamationTriangleIcon className="w-4 h-4 text-accent shrink-0" />
                <span>تنبيه هام للمستثمرين</span>
              </div>
              <p className="text-xs text-amber-900/90 leading-relaxed font-medium">
                جميع الحسابات والنسب المتعلقة بالعائد الإيجاري اليومي ونمو القيمة التراكمي هي مؤشرات اقتصادية تقديرية مبنية على حركة السوق، وليست ضماناً تعاقدياً قطعياً.
              </p>
            </div>

            {/* Quick Contact Card */}
            <div className="bg-gradient-to-br from-primary to-[#1f4287] text-white p-5 rounded-3xl shadow-sm space-y-3">
              <h3 className="text-sm font-bold font-cairo">الدعم القانوني والاستفسارات</h3>
              <p className="text-xs text-gray-200 leading-relaxed">
                لأي أسئلة بخصوص الشروط والأحكام أو حقوق الوساطة العقارية:
              </p>
              <div className="pt-2 border-t border-white/10 space-y-2 text-xs">
                <a href="mailto:legal@buhoor.com.eg" className="flex items-center gap-2 text-gray-200 hover:text-white transition break-all">
                  <EnvelopeIcon className="w-4 h-4 text-accent shrink-0" />
                  <span>legal@buhoor.com.eg</span>
                </a>
                <a href="tel:+201000000000" className="flex items-center gap-2 text-gray-200 hover:text-white transition" dir="ltr">
                  <PhoneIcon className="w-4 h-4 text-accent shrink-0" />
                  <span>+20 100 000 0000</span>
                </a>
              </div>
            </div>
          </aside>

          {/* Legal Text Body */}
          <main className="lg:col-span-8 bg-white p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border border-gray-200/80 shadow-xs space-y-8 sm:space-y-10 text-gray-700 leading-relaxed text-sm md:text-base">
            
            {/* 1. قبول الشروط */}
            <section id="acceptance" className="scroll-mt-24 space-y-3">
              <h2 className="text-lg sm:text-xl font-black text-gray-900 font-cairo flex items-center gap-2 border-b pb-3">
                <span className="text-primary">1.</span>
                <span>قبول الشروط والأحكام</span>
              </h2>
              <p>
                يُعد تصفحك لمنصة بحور العقارية أو استخدامك لأي من خدماتها (بما في ذلك استعراض العقارات، التواصل لطلب المعاينة، تسجيل الاهتمام بوحدة، أو إضافة عقار للبيع) موافقة صريحة وغير مشروطة منك على الالتزام بجميع بنود هذه الشروط والأحكام وبسياسة الخصوصية الخاصة بنا.
              </p>
              <p>
                إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى التوقف فوراً عن استخدام المنصة.
              </p>
            </section>

            {/* 2. طبيعة دور المنصة */}
            <section id="role" className="scroll-mt-24 space-y-3">
              <h2 className="text-lg sm:text-xl font-black text-gray-900 font-cairo flex items-center gap-2 border-b pb-3">
                <span className="text-primary">2.</span>
                <span>طبيعة دور منصة بحور العقارية</span>
              </h2>
              <p>
                تعمل <strong>منصة بحور</strong> كمنصة تسويق وبوابة إلكترونية متطورة تربط بين الباحثين عن عقارات راقية واستثمارات سياحية وسكنية من جهة، وبين المطورين العقاريين المعتمدين والملاك الأفراد (سوق إعادة البيع - Resale) من جهة أخرى.
              </p>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80 space-y-2 text-sm">
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  <BuildingOffice2Icon className="w-5 h-5 text-primary shrink-0" />
                  <span>حدود العلاقة التعاقدية:</span>
                </div>
                <p className="text-gray-600 text-xs md:text-sm">
                  المنصة تقدم خدمات العرض والترويج والتنسيق المبدئي وتسهيل المعاينات. العقود النهائية للبيع والشراء والمدفوعات المالية تتم مباشرة بين العميل والطرف البائع (المطور العقاري أو المالك الفردي) بعد قيام الطرفين بكافة المراجعات القانونية اللازمة، ما لم يتم إبرام اتفاق وساطة أو إدارة صريح ومكتوب بين المنصة وأحد الأطراف.
                </p>
              </div>
            </section>

            {/* 3. إخلاء مسؤولية حاسبات العائد الاستثماري */}
            <section id="investment-disclaimer" className="scroll-mt-24 space-y-4">
              <h2 className="text-lg sm:text-xl font-black text-gray-900 font-cairo flex items-center gap-2 border-b pb-3">
                <span className="text-primary">3.</span>
                <span>إخلاء مسؤولية حاسبات العائد الاستثماري (ROI)</span>
              </h2>
              
              <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 p-4 sm:p-5 rounded-2xl border border-amber-200 text-amber-950 space-y-3">
                <div className="flex items-center gap-2 font-extrabold text-sm sm:text-base text-amber-900">
                  <BanknotesIcon className="w-5 h-5 text-accent shrink-0" />
                  <span>توضيح صريح حول التوقعات المالية ودراسات الجدوى:</span>
                </div>
                <p className="text-xs md:text-sm leading-relaxed">
                  تتضمن منصة بحور أدوات وحاسبات استثمارية تقدم تقديرات للعائد الإيجاري السنوي (بافتراض إشغال 270 ليلة بنسبة 75%)، ومعدل نمو رأس المال التراكمي المركّب (30% للمشاريع الساحلية والبحرية، و 10% للمشاريع السكنية)، وإجمالي العائد المركب وفترة استرداد رأس المال.
                </p>
                <div className="bg-white/80 p-3 sm:p-3.5 rounded-xl border border-amber-200/80 text-xs font-semibold text-amber-900 space-y-1.5">
                  <p>• هذه الأرقام هي <strong>مؤشرات تحليلية وتقديرية استرشادية</strong> مستخلصة من حركة السوق والبيانات التاريخية للإيجار الفندقي والمواسم السياحية.</p>
                  <p>• هذه الحسابات <strong>لا تُعتبر وعداً قاطعاً أو ضماناً تعاقدياً ملزماً</strong> بتحقيق هذه الأرباح أو الأسعار، كما لا تُعد استشارة مالية أو استثمارية ملزمة قانوناً.</p>
                  <p>• العوائد الفعلية تتأثر بعوامل متعددة تشمل حالة التأثيث، إدارة التشغيل، تقلبات أسعار الصرف والتضخم، والظروف الاقتصادية العامة.</p>
                </div>
              </div>
            </section>

            {/* 4. ضوابط إضافة العقارات */}
            <section id="listing-rules" className="scroll-mt-24 space-y-3">
              <h2 className="text-lg sm:text-xl font-black text-gray-900 font-cairo flex items-center gap-2 border-b pb-3">
                <span className="text-primary">4.</span>
                <span>ضوابط إضافة العقارات والإعلانات</span>
              </h2>
              <p>عند قيامك بإضافة عقار عبر ميزة &quot;أضف عقارك&quot;، فإنك تتعهد وتلتزم بالآتي:</p>
              <ul className="list-disc pr-5 space-y-2 text-sm text-gray-600">
                <li>أن تكون المالك الشرعي للوحدة أو وكيلاً مفوضاً رسمياً بتسويقها قانوناً.</li>
                <li>صحة ودقة جميع البيانات المقدمة المتعلقة بمساحة العقار، سعره الإجمالي، نظام الأقساط، وحالة التشطيب والتسليم.</li>
                <li>أن تكون الصور ومقاطع الفيديو المرفوعة حقيقية وخاصة بالوحدة المعروضة دون تضليل.</li>
                <li>خلو العقار من أي نزاعات قضائية أو موانع قانونية تحول دون بيعه أو تأجيره.</li>
                <li>تحتفظ إدارة بحور بالحق الكامل في مراجعة أي إعلان، أو طلب تعديل بياناته، أو رفض نشره، أو حذفه دون إبداء أسباب في حال عدم استيفائه للشروط.</li>
              </ul>
            </section>

            {/* 5. التزامات المستخدم والمشتري */}
            <section id="user-obligations" className="scroll-mt-24 space-y-3">
              <h2 className="text-lg sm:text-xl font-black text-gray-900 font-cairo flex items-center gap-2 border-b pb-3">
                <span className="text-primary">5.</span>
                <span>التزامات المستخدم والمشتري</span>
              </h2>
              <p>يلتزم كل زائر ومستخدم للمنصة بما يلي:</p>
              <ul className="list-disc pr-5 space-y-2 text-sm text-gray-600">
                <li>تقديم بيانات صحيحة ودقيقة (الاسم ورقم الهاتف الفعلي) عند طلب تفاصيل أو معاينة عقار.</li>
                <li>عدم استخدام المنصة في أي أنشطة احتيالية أو غير مشروعة أو الإضرار بالبنية التحتية للموقع.</li>
                <li>التحقق الذاتي من سند ملكية العقار وصحة التراخيص والتسجيل بالشهر العقاري أو لدى شركة التطوير قبل دفع أي مقدمات أو تحويلات مالية.</li>
              </ul>
            </section>

            {/* 6. الملكية الفكرية */}
            <section id="intellectual-property" className="scroll-mt-24 space-y-3">
              <h2 className="text-lg sm:text-xl font-black text-gray-900 font-cairo flex items-center gap-2 border-b pb-3">
                <span className="text-primary">6.</span>
                <span>حقوق الملكية الفكرية</span>
              </h2>
              <p>
                العلامة التجارية &quot;بحور&quot;، والشعار، والتصميمات البرمجية، والأكواد، وقواعد البيانات، وطريقة تنظيم وعرض المحتوى وحاسبات العائد، هي ملكية حصرية لمنصة بحور العقارية ومحمية بموجب قوانين الملكية الفكرية المعمول بها. يُحظر نسخ أو استنساخ أو إعادة نشر أو هندسة عكسية لأي جزء من المنصة دون إذن كتابي مسبق.
              </p>
            </section>

            {/* 7. حدود المسؤولية */}
            <section id="limitation-liability" className="scroll-mt-24 space-y-3">
              <h2 className="text-lg sm:text-xl font-black text-gray-900 font-cairo flex items-center gap-2 border-b pb-3">
                <span className="text-primary">7.</span>
                <span>حدود المسؤولية القانونية</span>
              </h2>
              <p>
                نبذل أقصى جهد لضمان دقة وتحديث البيانات المنشورة على المنصة. ومع ذلك، فإن المنصة لا تقدم أي تعهدات أو ضمانات صريحة أو ضمنية بشأن خلو البيانات من الأخطاء غير المقصودة أو التغييرات التي قد تطرأ على أسعار المطورين أو حالة توافر الوحدات.
              </p>
              <p>
                لا تتحمل بحور أي مسؤولية عن أي خسائر مباشرة أو غير مباشرة ناتجة عن أي معاملات مالية أو تعاقدات تتم بين أطراف خارج نطاق المنصة المباشر دون توثيق قانوني معتمد.
              </p>
            </section>

            {/* 8. القانون الواجب التطبيق */}
            <section id="governing-law" className="scroll-mt-24 space-y-3">
              <h2 className="text-lg sm:text-xl font-black text-gray-900 font-cairo flex items-center gap-2 border-b pb-3">
                <span className="text-primary">8.</span>
                <span>القانون الواجب التطبيق والنزاعات</span>
              </h2>
              <p>
                تخضع هذه الشروط والأحكام وتُفسر وفقاً للقوانين واللوائح السارية في <strong>جمهورية مصر العربية</strong>. وتختص المحاكم المصرية المختصة بالقاهرة بالنظر في أي نزاع قد ينشأ عن استخدام المنصة أو تطبيق هذه الاتفاقية.
              </p>
            </section>

            {/* 9. التعديلات والتواصل */}
            <section id="modifications" className="scroll-mt-24 space-y-4 pt-2">
              <h2 className="text-lg sm:text-xl font-black text-gray-900 font-cairo flex items-center gap-2 border-b pb-3">
                <span className="text-primary">9.</span>
                <span>تعديل الشروط والتواصل</span>
              </h2>
              <p>
                تحتفظ منصة بحور بالحق في تحديث أو تعديل هذه الشروط في أي وقت. وتصبح التعديلات نافذة فور نشرها على هذه الصفحة مع تحديث تاريخ &quot;آخر تحديث&quot;.
              </p>
              <div className="bg-gray-50 p-4 sm:p-5 rounded-2xl border border-gray-200/80 space-y-2 text-sm">
                <p><strong>منصة بحور العقارية (Buhoor Real Estate)</strong></p>
                <p>الدائرة القانونية: <a href="mailto:legal@buhoor.com.eg" className="text-primary font-bold hover:underline break-all">legal@buhoor.com.eg</a></p>
                <p>خدمة العملاء: <span dir="ltr" className="font-bold text-gray-800">+20 100 000 0000</span></p>
                <p>جمهورية مصر العربية</p>
              </div>
            </section>

            {/* Mobile Contact & Disclaimer Cards (Visible at bottom on mobile) */}
            <div className="lg:hidden pt-6 border-t border-gray-100 space-y-4">
              <div className="bg-amber-500/10 border border-amber-300/80 p-4 rounded-2xl space-y-2 text-amber-950">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs font-cairo">
                  <ExclamationTriangleIcon className="w-4 h-4 text-accent shrink-0" />
                  <span>تنبيه هام للمستثمرين</span>
                </div>
                <p className="text-xs text-amber-900/90 leading-relaxed font-medium">
                  جميع الحسابات والنسب المتعلقة بالعائد الإيجاري ونمو القيمة هي مؤشرات اقتصادية استرشادية مبنية على حركة السوق وليست ضماناً تعاقدياً.
                </p>
              </div>

              <div className="bg-gradient-to-br from-primary to-[#1f4287] text-white p-5 rounded-2xl shadow-sm space-y-3">
                <h3 className="text-sm font-bold font-cairo">الدعم القانوني والاستفسارات</h3>
                <div className="pt-2 border-t border-white/10 space-y-2 text-xs">
                  <a href="mailto:legal@buhoor.com.eg" className="flex items-center gap-2 text-gray-200 hover:text-white transition break-all">
                    <EnvelopeIcon className="w-4 h-4 text-accent shrink-0" />
                    <span>legal@buhoor.com.eg</span>
                  </a>
                  <a href="tel:+201000000000" className="flex items-center gap-2 text-gray-200 hover:text-white transition" dir="ltr">
                    <PhoneIcon className="w-4 h-4 text-accent shrink-0" />
                    <span>+20 100 000 0000</span>
                  </a>
                </div>
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}
