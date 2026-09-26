'use client';

import React, { useState } from 'react';
import { 
  ShareIcon, 
  LinkIcon, 
  CheckIcon, 
  XMarkIcon,
  DevicePhoneMobileIcon,
  ChatBubbleLeftEllipsisIcon
} from '@heroicons/react/24/outline';

interface ShareButtonProps {
  title: string;
  description?: string;
  url?: string;
  priceText?: string;
  deepLinkPath?: string; // e.g. "/units/123"
  buttonText?: string;
  variant?: 'primary' | 'outline' | 'ghost' | 'icon';
  className?: string;
}

export default function ShareButton({
  title,
  description,
  url,
  priceText,
  deepLinkPath = '',
  buttonText = 'مشاركة',
  variant = 'outline',
  className = '',
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const getFullUrl = () => {
    if (url) return url;
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return 'https://buhoor-web.vercel.app';
  };

  const getShareText = () => {
    const lines = [
      `🏡 ${title}`,
      priceText ? `💰 السعر: ${priceText}` : null,
      description ? `📝 ${description}` : null,
      `🔗 رابط التفاصيل: ${getFullUrl()}`,
      `منصة بُحور للعقارات 🇪🇬`
    ].filter(Boolean);

    return lines.join('\n');
  };

  const handleNativeShare = async (e?: React.MouseEvent) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    const fullUrl = getFullUrl();
    const shareText = getShareText();

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: fullUrl,
        });
        return;
      } catch (err) {
        // User cancelled or share failed, fallback to modal
        console.log('Share dismissed or failed', err);
      }
    }
    setIsOpen(true);
  };

  const copyToClipboard = async () => {
    const fullUrl = getFullUrl();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = fullUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(getShareText());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const shareToFacebook = () => {
    const fullUrl = encodeURIComponent(getFullUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${fullUrl}`, '_blank');
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(`🏡 ${title}${priceText ? ` | ${priceText}` : ''}\n\n`);
    const fullUrl = encodeURIComponent(getFullUrl());
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${fullUrl}`, '_blank');
  };

  const shareToSms = () => {
    const text = encodeURIComponent(getShareText());
    window.location.href = `sms:?&body=${text}`;
  };

  const openInAppScheme = () => {
    const cleanPath = deepLinkPath.startsWith('/') ? deepLinkPath.slice(1) : deepLinkPath;
    const appSchemeUrl = `bohoor://${cleanPath}`;
    window.location.href = appSchemeUrl;
  };

  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary hover:bg-primary/90 text-white font-bold px-4 py-2.5 rounded-2xl shadow-sm transition flex items-center justify-center gap-2';
      case 'ghost':
        return 'text-gray-600 hover:text-primary hover:bg-gray-100 p-2.5 rounded-full transition flex items-center justify-center';
      case 'icon':
        return 'w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-primary shadow-sm border border-gray-100 flex items-center justify-center transition';
      case 'outline':
      default:
        return 'border border-gray-200 hover:border-primary/40 bg-white hover:bg-gray-50 text-gray-700 hover:text-primary font-semibold px-4 py-2 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-xs';
    }
  };

  return (
    <>
      <button 
        type="button"
        onClick={handleNativeShare}
        className={`${getButtonStyles()} ${className}`}
        title="مشاركة"
        aria-label="مشاركة"
      >
        <ShareIcon className="w-5 h-5 text-current shrink-0" />
        {variant !== 'icon' && variant !== 'ghost' && (
          <span>{buttonText}</span>
        )}
      </button>

      {/* Share Modal Dialog */}
      {isOpen && (
        <div 
          onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative transform transition-all"
            dir="rtl"
          >
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <ShareIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">مشاركة الرابط</h3>
                  <p className="text-xs text-gray-500">شارك العقار عبر التطبيقات أو انسخ الرابط</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition"
                aria-label="إغلاق"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Target Item Preview */}
            <div className="my-4 p-3 bg-gray-50 rounded-2xl border border-gray-100">
              <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{title}</h4>
              {priceText && (
                <p className="text-xs font-semibold text-accent mt-0.5">{priceText}</p>
              )}
            </div>

            {/* Direct Sharing Platforms */}
            <div className="grid grid-cols-4 gap-3 my-5">
              {/* WhatsApp */}
              <button
                type="button"
                onClick={shareToWhatsApp}
                className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-emerald-50 transition group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <ChatBubbleLeftEllipsisIcon className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-gray-700">واتساب</span>
              </button>

              {/* Facebook */}
              <button
                type="button"
                onClick={shareToFacebook}
                className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-blue-50 transition group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#1877F2] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform font-bold text-xl">
                  f
                </div>
                <span className="text-xs font-medium text-gray-700">فيسبوك</span>
              </button>

              {/* SMS */}
              <button
                type="button"
                onClick={shareToSms}
                className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-amber-50 transition group"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <DevicePhoneMobileIcon className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-gray-700">رسائل SMS</span>
              </button>

              {/* Twitter / X */}
              <button
                type="button"
                onClick={shareToTwitter}
                className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-gray-100 transition group"
              >
                <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform font-bold text-lg">
                  𝕏
                </div>
                <span className="text-xs font-medium text-gray-700">إكس (تويتر)</span>
              </button>
            </div>

            {/* Open In Bohoor App Option */}
            {deepLinkPath && (
              <div className="mb-4 p-3.5 bg-gradient-to-r from-primary/5 to-accent/10 rounded-2xl border border-primary/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                    ب
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">فتح في تطبيق بُحور</p>
                    <p className="text-[11px] text-gray-500">للأجهزة المحمولة المثبت عليها التطبيق</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={openInAppScheme}
                  className="bg-primary hover:bg-primary/90 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow-xs shrink-0"
                >
                  فتح التطبيق
                </button>
              </div>
            )}

            {/* Copy Link Input Bar */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <label className="text-xs font-semibold text-gray-600 block mb-2">أو نسخ رابط المشاركة:</label>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl p-1.5 focus-within:border-primary transition">
                <input 
                  type="text" 
                  readOnly 
                  value={getFullUrl()} 
                  className="bg-transparent flex-1 text-xs text-gray-600 px-2 outline-hidden truncate dir-ltr text-left"
                />
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                    copied 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-primary hover:bg-primary/90 text-white'
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckIcon className="w-4 h-4" />
                      <span>تم النسخ!</span>
                    </>
                  ) : (
                    <>
                      <LinkIcon className="w-4 h-4" />
                      <span>نسخ</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
