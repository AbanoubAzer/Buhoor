import { Metadata } from 'next';
import Link from 'next/link';
import { 
  ShieldCheckIcon, 
  LockClosedIcon, 
  UserGroupIcon, 
  DocumentTextIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  ChevronLeftIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية | منصة بحور العقارية',
  description: 'تعرف على سياسة الخصوصية وحماية البيانات المتبعة في منصة بحور العقارية لضمان سرية وأمان معلومات المستخدمين والمستثمرين والعملاء.',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = '23 سبتمبر 2026';

  const sections = [
    { id: 'intro', title: '1. مقدمة ونطاق التطبيق' },
    { id: 'collection', title: '2. البيانات التي نقوم بجمعها' },
    { id: 'usage', title: '3. كيف نستخدم معلوماتك' },
    { id: 'sharing', title: '4. مشاركة البيانات مع أطراف ثالثة' },
    { id: 'security', title: '5. أمان وحماية المعلومات' },
    { id: 'cookies', title: '6. ملفات تعريف الارتباط (Cookies)' },
    { id: 'rights', title: '7. حقوق المستخدم والتحكم في البيانات' },
    { id: 'contact', title: '8. تواصل معنا والاستفسارات' },
  ];

  return (
    <div className="min-h-screen bg-gray-50/60 pb-20">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0c1b37] via-[#152D5B] to-[#1a3870] text-white py-14 lg:py-20">
        <div className="absolute inset-0 opacity-10 pattern-dots pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-300 mb-6">
            <Link href="/" className="hover:text-accent transition">الرئيسية</Link>
            <ChevronLeftIcon className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-white font-semibold">سياسة الخصوصية</span>
          </nav>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-accent border border-white/10 mb-4">
                <ShieldCheckIcon className="w-4 h-4" />
                <span>حماية البيانات والسرية</span>
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black font-cairo tracking-tight leading-tight">
                سياسة الخصوصية
              </h1>
              <p className="mt-3 text-base md:text-lg text-gray-200 max-w-2xl font-light">
                نلتزم في منصة بحور العقارية بحماية خصوصيتك وبياناتك الشخصية بأعلى معايير الأمان والشفافية.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3 rounded-2xl text-xs text-gray-200">
              <span className="block text-gray-300">آخر تحديث:</span>
              <span className="font-bold text-white text-sm">{lastUpdated}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-4 sticky top-24 space-y-5">
            <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs">
              <h2 className="text-sm font-bold text-gray-900 mb-4 font-cairo flex items-center gap-2">
                <DocumentTextIcon className="w-4 h-4 text-primary" />
                <span>فهرس المحتويات</span>
              </h2>
              <ul className="space-y-2 text-xs font-semibold text-gray-600">
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

            {/* Quick Support Card */}
            <div className="bg-gradient-to-br from-primary to-[#1f4287] text-white p-5 rounded-3xl shadow-sm space-y-3">
              <h3 className="text-sm font-bold font-cairo flex items-center gap-2">
                <LockClosedIcon className="w-4 h-4 text-accent" />
                <span>أمان بياناتك أولويتنا</span>
              </h3>
              <p className="text-xs text-gray-200 leading-relaxed">
                إذا كان لديك أي تساؤل حول كيفية معالجة معلوماتك أو ترغب في ممارسة حقوقك في تصحيح أو حذف البيانات، لا تتردد في مراسلتنا.
              </p>
              <div className="pt-2 border-t border-white/10 space-y-2 text-xs">
                <a href="mailto:privacy@buhoor.com.eg" className="flex items-center gap-2 text-gray-200 hover:text-white transition">
                  <EnvelopeIcon className="w-4 h-4 text-accent" />
                  <span>privacy@buhoor.com.eg</span>
                </a>
                <a href="tel:+201000000000" className="flex items-center gap-2 text-gray-200 hover:text-white transition" dir="ltr">
                  <PhoneIcon className="w-4 h-4 text-accent" />
                  <span>+20 100 000 0000</span>
                </a>
              </div>
            </div>
          </aside>

          {/* Legal Text Body */}
          <main className="lg:col-span-8 bg-white p-6 md:p-10 rounded-3xl border border-gray-200/80 shadow-xs space-y-10 text-gray-700 leading-relaxed text-sm md:text-base">
            
            {/* 1. مقدمة */}
            <section id="intro" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-black text-gray-900 font-cairo flex items-center gap-2 border-b pb-3">
                <span className="text-primary">1.</span>
                <span>مقدمة ونطاق التطبيق</span>
              </h2>
              <p>
                مرحباً بكم في <strong>منصة بحور العقارية (&quot;بحور&quot;، &quot;نحن&quot;، &quot;المنصة&quot;)</strong>، المنصة المتخصصة في تيسير عرض واكتشاف والاستثمار في العقارات السياحية الفاخرة والمشاريع السكنية الراقية في مصر (مثل الجونة، الساحل الشمالي، البحر الأحمر، القاهرة الجديدة، والشيخ زايد).
              </p>
              <p>
                تحدد سياسة الخصوصية هذه الكيفية التي نجمع بها، ونستخدم، ونشارك، ونحمي بها المعلومات الشخصية التي تقدمها لنا أثناء استخدامك لموقعنا الإلكتروني، أو عند إرسال استفسارات المعاينة، أو إضافة عقار للبيع أو الإيجار، أو استخدام حاسبات العائد الاستثماري التقديري.
              </p>
            </section>

            {/* 2. البيانات التي نقوم بجمعها */}
            <section id="collection" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-black text-gray-900 font-cairo flex items-center gap-2 border-b pb-3">
                <span className="text-primary">2.</span>
                <span>البيانات التي نقوم بجمعها</span>
              </h2>
              <p>نقوم بجمع عدة أنواع من المعلومات لتقديم خدماتنا العقارية بكفاءة وموثوقية:</p>
              <ul className="space-y-2.5 pr-2">
                <li className="flex items-start gap-2.5">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>بيانات التواصل الشخصية:</strong> مثل الاسم الكامل، رقم الهاتف (بما في ذلك تطبيق واتساب)، وعنوان البريد الإلكتروني عند طلب تفاصيل وحدة، حجز موعد معاينة، أو إرسال استفسار.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>بيانات العقارات المعروضة:</strong> عند قيامك بإضافة عقار للبيع (سواء كنت مالكاً فردياً أو مطوراً)، نجمع تفاصيل الوحدة مثل: المساحة، التقسيم الداخلي، السعر المطلوب، نظام الدفع، الصور، الفيديوهات، والموقع الجغرافي.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>الاهتمامات الاستثمارية والتفضيلات:</strong> تفضيلاتك بشأن المواقع المستهدفة (ساحلي/سكني)، الميزانية، طريقة الدفع المفضلة (كاش أو أقساط)، وحسابات العائد الإيجاري اليومي المتوقع.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>بيانات تقنية آلية:</strong> عنوان بروتوكول الإنترنت (IP)، نوع المتصفح، نظام التشغيل، الصفحات التي قمت بزيارتها، ومدة التصفح لضمان أمان الموقع وتحسين الأداء.</span>
                </li>
              </ul>
            </section>

            {/* 3. كيف نستخدم معلوماتك */}
            <section id="usage" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-black text-gray-900 font-cairo flex items-center gap-2 border-b pb-3">
                <span className="text-primary">3.</span>
                <span>كيف نستخدم معلوماتك</span>
              </h2>
              <p>نستخدم البيانات التي نجمعها للأغراض التالية فقط:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-1 text-sm">🤝 ربط المشترين بالبائعين</h4>
                  <p className="text-xs text-gray-600">تسهيل التواصل بين المستثمر أو المشتري والطرف البائع (المطور العقاري أو المالك الفردي) لترتيب المعاينة والتفاوض.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-1 text-sm">📊 تقديم استشارات الجدوى</h4>
                  <p className="text-xs text-gray-600">مساعدة المستثمر في تقييم العوائد الإيجارية ونمو رأس المال التراكمي وتوفير الخيارات المناسبة لميزانيته.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-1 text-sm">🛡️ مراجعة الإعلانات والتحقق</h4>
                  <p className="text-xs text-gray-600">مراجعة بيانات الوحدات المرفوعة للبيع للتأكد من جديتها ومطابقتها لمعايير الجودة المعتمدة بالمنصة.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-1 text-sm">⚡ الدعم الفني وتطوير التجربة</h4>
                  <p className="text-xs text-gray-600">الإجابة على استفسارات المستخدمين وتطوير المنصة وحل أي مشاكل تقنية قد تواجه الزوار.</p>
                </div>
              </div>
            </section>

            {/* 4. مشاركة البيانات */}
            <section id="sharing" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-black text-gray-900 font-cairo flex items-center gap-2 border-b pb-3">
                <span className="text-primary">4.</span>
                <span>مشاركة البيانات مع أطراف ثالثة</span>
              </h2>
              <div className="bg-amber-50/80 border border-amber-200 text-amber-950 p-4 rounded-2xl text-xs md:text-sm font-medium">
                <strong>تأكيد حاسم:</strong> منصة بحور لا تقوم إطلاقاً ببيع أو تأجير بياناتك الشخصية لأي شركات تسويق خارجية أو أطراف مجهولة دون موافقتك.
              </div>
              <p>تتم مشاركة البيانات حصرياً في النطاقات المحددة التالية:</p>
              <ul className="list-disc pr-5 space-y-2 text-sm text-gray-600">
                <li><strong>المطورون العقاريون وملاك الوحدات:</strong> عند قيامك بالضغط على زر &quot;طلب تفاصيل&quot; أو ملء استمارة الاهتمام بوحدة معينة، نشارك بياناتك (الاسم ورقم الهاتف) مع فريق المبيعات المعني بالعقار لمتابعة طلبك.</li>
                <li><strong>مزودو الخدمات التقنية المعتمدون:</strong> مقدمو خدمات الاستضافة السحابية الآمنة، خدمات إرسال الإشعارات، وتخزين الصور السحابي الموثوق.</li>
                <li><strong>الالتزام القانوني:</strong> الإفصاح عن البيانات فقط في الحالات التي يتطلبها القانون المصري أو بناءً على أوامر قضائية رسمية واجبة النفاذ.</li>
              </ul>
            </section>

            {/* 5. أمان وحماية المعلومات */}
            <section id="security" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-black text-gray-900 font-cairo flex items-center gap-2 border-b pb-3">
                <span className="text-primary">5.</span>
                <span>أمان وحماية المعلومات</span>
              </h2>
              <p>
                نطبق معايير أمنية وإدارية وتقنية متقدمة لحماية بياناتك من الفقدان أو الوصول غير المصرح به أو التعديل، ومنها:
              </p>
              <ul className="list-disc pr-5 space-y-1.5 text-sm text-gray-600">
                <li>استخدام بروتوكول التشفير الآمن (SSL/HTTPS) في كافة عمليات نقل البيانات عبر الموقع.</li>
                <li>قواعد بيانات سحابية مشفرة ومحمية بآليات جدار ناري وصلاحيات وصول صارمة.</li>
                <li>التحديث المستمر للبنية التحتية لمنع الثغرات والاختراقات.</li>
              </ul>
            </section>

            {/* 6. ملفات تعريف الارتباط */}
            <section id="cookies" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-black text-gray-900 font-cairo flex items-center gap-2 border-b pb-3">
                <span className="text-primary">6.</span>
                <span>ملفات تعريف الارتباط (Cookies)</span>
              </h2>
              <p>
                نستخدم ملفات تعريف الارتباط والتقنيات المماثلة لتحسين تجربة تصفحك، مثل حفظ العقارات المفضلة، وتذكر خيارات البحث والتصفية، وتحليل أداء الموقع. يمكنك التحكم في إعدادات ملفات تعريف الارتباط أو تعطيلها من خلال متصفحك الخاص، مع ملاحظة أن بعض وظائف المنصة قد تتأثر بذلك.
              </p>
            </section>

            {/* 7. حقوق المستخدم */}
            <section id="rights" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-black text-gray-900 font-cairo flex items-center gap-2 border-b pb-3">
                <span className="text-primary">7.</span>
                <span>حقوق المستخدم والتحكم في البيانات</span>
              </h2>
              <p>وفقاً للتشريعات المنظمة لحماية البيانات، يحق لك في أي وقت:</p>
              <ul className="space-y-2 pr-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  <span>طلب نسخة من المعلومات الشخصية المخزنة لدينا عنك.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  <span>طلب تصحيح أو تحديث أي بيانات غير دقيقة.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  <span>طلب حذف بياناتك أو إلغاء إعلان العقار الذي قمت بإضافته.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  <span>إلغاء الاشتراك في أي رسائل إخبارية أو ترويجية مستقبلية.</span>
                </li>
              </ul>
            </section>

            {/* 8. تواصل معنا */}
            <section id="contact" className="scroll-mt-24 space-y-4 pt-2">
              <h2 className="text-xl font-black text-gray-900 font-cairo flex items-center gap-2 border-b pb-3">
                <span className="text-primary">8.</span>
                <span>تواصل معنا والاستفسارات</span>
              </h2>
              <p>
                إذا كان لديك أي استفسار أو رغبة في تقديم طلب يتعلق بسياسة الخصوصية، يرجى التواصل مع فريق الخصوصية والامتثال عبر:
              </p>
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200/80 space-y-2 text-sm">
                <p><strong>منصة بحور العقارية (Buhoor Real Estate)</strong></p>
                <p>البريد الإلكتروني: <a href="mailto:privacy@buhoor.com.eg" className="text-primary font-bold hover:underline">privacy@buhoor.com.eg</a></p>
                <p>الهاتف / واتساب: <span dir="ltr" className="font-bold text-gray-800">+20 100 000 0000</span></p>
                <p>جمهورية مصر العربية</p>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}
