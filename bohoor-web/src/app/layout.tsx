import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { HomeIcon, MagnifyingGlassIcon, BuildingOffice2Icon, CheckCircleIcon } from "@heroicons/react/24/outline";
import Header from "@/components/Header";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "منصة بحور | العقارات بأسلوب عصري",
  description: "اكتشف أحدث وأفضل العقارات والمشاريع من كبار المطورين في منصة بحور.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-cairo bg-gray-50 text-gray-900">
        
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {children}
        </main>

        <footer className="bg-primary text-white pt-0 pb-8 mt-auto rounded-t-[3rem] overflow-hidden">
          {/* Trust Banner */}
          <div className="bg-[#0f2142] py-4 relative overflow-hidden mb-12">
            <div className="absolute inset-y-0 right-0 w-1/3 bg-accent/10 rounded-l-[100px] blur-2xl"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row justify-between items-center text-sm gap-6">
              <div className="flex items-center gap-2 text-gray-300 hover:text-white transition cursor-pointer">
                <span className="font-bold">عربي</span>
                <span className="text-lg">🇪🇬</span>
              </div>
              
              <div className="flex gap-8 items-center text-gray-300">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-accent" />
                  <span>دعم وخدمة مميزة</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-accent" />
                  <span>تجربة آمنة وسهلة</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-accent" />
                  <span>بيانات فعالة ومؤمنة</span>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <div>
                <img src="/logo.jpg" alt="Buhoor" className="h-12 mb-6 opacity-90 rounded-xl" />
                <p className="text-primary-100 text-sm leading-relaxed text-gray-300">
                  وجهتك الموثوقة لشراء وبيع العقارات في مصر. نربطك بأفضل المطورين العقاريين لضمان استثمار آمن ومستقبل مشرق.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-6 font-cairo">روابط سريعة</h3>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li><Link href="/units?type=apartment" className="hover:text-accent transition">شقق للبيع</Link></li>
                  <li><Link href="/units?type=villa" className="hover:text-accent transition">فلل للبيع</Link></li>
                  <li><Link href="/developers" className="hover:text-accent transition">أشهر المطوّرين</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-6 font-cairo">المناطق الأكثر طلباً</h3>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li><Link href="/areas/new-cairo" className="hover:text-accent transition">القاهرة الجديدة</Link></li>
                  <li><Link href="/areas/sheikh-zayed" className="hover:text-accent transition">الشيخ زايد</Link></li>
                  <li><Link href="/areas/north-coast" className="hover:text-accent transition">الساحل الشمالي</Link></li>
                  <li><Link href="/areas/new-capital" className="hover:text-accent transition">العاصمة الإدارية</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-6 font-cairo">تواصل معنا</h3>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li><a href="mailto:info@buhoor.com.eg" className="hover:text-accent transition">info@buhoor.com.eg</a></li>
                  <li><a href="tel:+201000000000" className="hover:text-accent transition" dir="ltr">+20 100 000 0000</a></li>
                  <li className="pt-4">
                    <Link href="/add-property" className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl font-medium transition inline-block border border-white/20">
                      أضف عقارك مجاناً
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
              <p>&copy; {new Date().getFullYear()} منصة بحور العقارية. جميع الحقوق محفوظة.</p>
              <div className="flex gap-4 mt-4 md:mt-0">
                <Link href="/privacy" className="hover:text-white transition">سياسة الخصوصية</Link>
                <Link href="/terms" className="hover:text-white transition">الشروط والأحكام</Link>
              </div>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}
