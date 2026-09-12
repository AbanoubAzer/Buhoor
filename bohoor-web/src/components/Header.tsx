"use client";

import { useState } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.jpg" alt="Buhoor Realty" className="h-10 object-contain rounded-lg" />
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex gap-6 items-center">
            <Link href="/" className="text-gray-600 hover:text-accent font-medium transition">الرئيسية</Link>
            <Link href="/projects" className="text-gray-600 hover:text-accent font-medium transition">المشاريع</Link>
            <Link href="/areas" className="text-gray-600 hover:text-accent font-medium transition">المناطق</Link>
            <Link href="/developers" className="text-gray-600 hover:text-accent font-medium transition">المطورين</Link>
            <Link href="/units" className="text-gray-600 hover:text-accent font-medium transition">العقارات</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/add-property" className="hidden sm:inline-flex items-center gap-2 bg-accent hover:bg-orange-600 text-white px-5 py-2 rounded-xl font-bold transition shadow-md shadow-accent/20 text-sm">
              أضف عقارك مجاناً &larr;
            </Link>
            
            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 hover:bg-gray-100 transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full left-0">
          <div className="space-y-1 px-4 pb-6 pt-4">
            <Link onClick={() => setMobileMenuOpen(false)} href="/" className="block rounded-lg px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-accent">الرئيسية</Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/projects" className="block rounded-lg px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-accent">المشاريع</Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/areas" className="block rounded-lg px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-accent">المناطق</Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/developers" className="block rounded-lg px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-accent">المطورين</Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/units" className="block rounded-lg px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-accent">العقارات</Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/add-property" className="block sm:hidden mt-4 bg-accent text-white text-center rounded-lg px-3 py-3 text-base font-bold shadow-md">
              أضف عقارك مجاناً
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
