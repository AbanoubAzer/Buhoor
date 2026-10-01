import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { HomeIcon, MagnifyingGlassIcon, BuildingOffice2Icon, CheckCircleIcon } from "@heroicons/react/24/outline";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";

import { cookies } from "next/headers";
import { Language } from "@/translations";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "منصة بحور | العقارات بأسلوب عصري",
  description: "اكتشف أحدث وأفضل العقارات والمشاريع من كبار المطورين في منصة بحور.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const savedLang = cookieStore.get("bohoor_lang")?.value;
  const initialLang: Language = (savedLang === "en" || savedLang === "ar") ? savedLang : "ar";
  const dir = initialLang === "ar" ? "rtl" : "ltr";

  return (
    <html lang={initialLang} dir={dir} className={`${cairo.variable} h-full antialiased`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var m = document.cookie.match(/(?:^|;\\s*)bohoor_lang=([^;]+)/);
                var l = (m && (m[1] === 'en' || m[1] === 'ar')) ? m[1] : localStorage.getItem('bohoor_lang');
                if (l === 'en' || l === 'ar') {
                  document.documentElement.lang = l;
                  document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
                  if (!m) {
                    document.cookie = 'bohoor_lang=' + l + ';path=/;max-age=31536000;SameSite=Lax';
                  }
                }
              } catch(e){}
            })();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-cairo bg-gray-50 text-gray-900">
        <LanguageProvider initialLanguage={initialLang}>
          {/* Header */}
          <Header />

          {/* Main Content */}
          <main className="flex-1 flex flex-col">
            {children}
          </main>

          <Footer />
        </LanguageProvider>

      </body>
    </html>
  );
}
