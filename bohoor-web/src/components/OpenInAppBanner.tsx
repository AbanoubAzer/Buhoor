'use client';

import React, { useState, useEffect } from 'react';
import { XMarkIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

interface OpenInAppBannerProps {
  path: string; // e.g. "units/123" or "projects/456"
  title?: string;
}

export default function OpenInAppBanner({
  path,
  title = 'تطبيق بُحور',
}: OpenInAppBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only display on mobile devices and if not previously dismissed in this session
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isDismissed = sessionStorage.getItem(`dismiss_app_banner_${path}`);
    if (isMobile && !isDismissed) {
      setIsVisible(true);
    }
  }, [path]);

  const handleOpenInApp = () => {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const appUrl = `bohoor://${cleanPath}`;

    // Record attempt
    const start = Date.now();
    window.location.href = appUrl;

    // Fallback: If after 1800ms the user is still on this web page, the app was likely not installed
    setTimeout(() => {
      if (document.hidden || document.visibilityState === 'hidden') {
        return; // App opened successfully
      }
      if (Date.now() - start < 2500) {
        // App is not installed, user remains on web
        console.log('App not installed, remaining on web');
      }
    }, 1800);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem(`dismiss_app_banner_${path}`, 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-primary to-[#0f284e] text-white px-4 py-2.5 shadow-md flex items-center justify-between gap-3 text-sm animate-fadeIn sticky top-0 z-40">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={handleDismiss}
          className="text-gray-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition shrink-0"
          aria-label="إغلاق"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>

        <div className="w-8 h-8 rounded-xl bg-accent text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
          ب
        </div>

        <div className="min-w-0">
          <p className="font-bold text-xs truncate">تطبيق بُحور متاح لهاتفك</p>
          <p className="text-[11px] text-gray-300 truncate">تصفح العقار بتجربة أسرع وسلسة</p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleOpenInApp}
        className="bg-accent hover:bg-accent/90 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition shadow-xs flex items-center gap-1.5 shrink-0 whitespace-nowrap active:scale-95"
      >
        <span>فتح في التطبيق</span>
        <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
