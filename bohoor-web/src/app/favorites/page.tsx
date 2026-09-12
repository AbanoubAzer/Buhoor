"use client";

import Link from "next/link";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";

export default function FavoritesPage() {
  // In a real application, favorites would be fetched from localStorage or an API
  const favorites: any[] = []; 

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-cairo text-gray-900 mb-4 tracking-tight">
            العقارات <span className="text-primary">المفضلة</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-cairo">
            جميع الوحدات والعقارات التي قمت بحفظها للرجوع إليها لاحقاً تظهر هنا.
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center max-w-2xl mx-auto animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <HeartIcon className="w-12 h-12 text-red-400 stroke-2" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 font-cairo">لا توجد عقارات في المفضلة</h2>
            <p className="text-gray-500 mb-8 font-cairo">
              قم بتصفح العقارات المتاحة واضغط على علامة القلب (❤️) لحفظ العقارات التي تنال إعجابك للرجوع لها بسرعة في أي وقت.
            </p>
            <Link href="/units" className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-2xl transition shadow-lg shadow-primary/20">
              تصفح العقارات الآن
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* When favorites exist, map them here */}
          </div>
        )}

      </div>
    </div>
  );
}
