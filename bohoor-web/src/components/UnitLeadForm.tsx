"use client";

import { useState, useMemo } from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/api/client";

interface UnitLeadFormProps {
  unitPrice: number;
  unitId: string;
  sellerType?: string;
}

export default function UnitLeadForm({ unitPrice, unitId, sellerType = 'DEVELOPER' }: UnitLeadFormProps) {
  const { t, isRTL, language } = useLanguage();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [questions, setQuestions] = useState("");
  const [readiness, setReadiness] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const isDeveloper = sellerType === 'DEVELOPER';

  // Memoize 1.25% commission only for individuals/resale
  const commission = useMemo(() => {
    if (isDeveloper) return "0";
    return unitPrice ? (unitPrice * 0.0125).toLocaleString(isRTL ? 'ar-EG' : 'en-US') : "0";
  }, [isDeveloper, unitPrice, isRTL]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
    const payload = {
      action: "NEW_LEAD",
      unitId: typeof window !== 'undefined' ? window.location.href : unitId,
      sellerType: isDeveloper ? "DEVELOPER" : "INDIVIDUAL",
      name,
      phone: formattedPhone,
      readiness,
      questions,
      language,
      commission: isDeveloper ? "0 (Direct Developer - 0% Commission)" : `${commission} EGP (1.25% Resale)`,
      source: "WEB",
    };

    try {
      await api.leads.create(payload);
      setSuccess(true);
    } catch (apiError: any) {
      console.error("Lead creation error:", apiError);
      alert(isRTL ? "حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى." : "Error sending request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-emerald-50 p-6 rounded-3xl text-center border border-emerald-100 shadow-sm" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
          ✓
        </div>
        <h3 className="text-xl font-bold text-emerald-800 mb-2">
          {isRTL ? "تم استلام طلبك بنجاح!" : "Request Received Successfully!"}
        </h3>
        <p className="text-emerald-700 text-sm">
          {isRTL ? "سيقوم فريقنا بالتواصل معك في أقرب وقت لترتيب المعاينة وتفاصيل الحجز." : "Our team will contact you shortly to arrange a viewing and booking details."}
        </p>
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-bold text-primary">{isRTL ? "جاري إرسال طلبك..." : "Sending your request..."}</p>
        </div>
      )}
      
      <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 sticky top-24" dir={isRTL ? 'rtl' : 'ltr'}>
        <h3 className="text-lg sm:text-xl font-bold text-primary mb-2">
          {isRTL ? "عايز تلحق تحجز الفرصة ديه؟" : "Want to secure this opportunity?"}
        </h3>
        <p className="text-sm text-gray-500 mb-4 leading-relaxed">
          {isRTL 
            ? "سيب اسمك ورقم الواتساب، وفريقنا هيكلّمك يراجع معاك كل التفاصيل."
            : "Leave your name and WhatsApp number, and our team will contact you to review all details."}
        </p>

        {/* Commission Banner - only show for resale where commission applies */}
        {!isDeveloper && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 mb-5 flex items-start gap-2.5">
            <span className="text-xl leading-none">ℹ️</span>
            <div>
              <p className="text-xs font-bold text-amber-900 mb-0.5">
                {isRTL ? "عمولة إعادة البيع (الأفراد)" : "Resale Commission (Individual)"}
              </p>
              <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                {isRTL 
                  ? `عمولة منصة بحور للمشتري هي 1.25% فقط (${commission} ج.م) تُدفع عند إتمام التنازل بنجاح. البائع لا يدفع أي عمولة.`
                  : `Bohoor buyer commission is 1.25% only (${commission} EGP), payable upon successful transfer. The seller pays 0%.`}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">
              {isRTL ? "الاسم" : "Full Name"} <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              required 
              value={name}
              onChange={e => setName(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary bg-gray-50 text-sm outline-none" 
              placeholder={isRTL ? "الاسم الكامل" : "Your Full Name"} 
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">
              {isRTL ? "رقم الواتساب" : "WhatsApp Number"} <span className="text-red-500">*</span>
            </label>
            <div dir="ltr">
              <PhoneInput
                country={'eg'}
                enableSearch={true}
                searchPlaceholder={isRTL ? "البحث عن الدولة..." : "Search country..."}
                value={phone}
                onChange={(p) => setPhone(p)}
                inputStyle={{ width: '100%', height: '48px', borderRadius: '0.75rem', borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}
                buttonStyle={{ borderRadius: '0.75rem 0 0 0.75rem', borderColor: '#e5e7eb', backgroundColor: '#f9fafb', direction: 'ltr' }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">
              {isRTL ? "إيه الأسئلة أو الاستفسارات التي تود معرفتها؟" : "What questions or inquiries do you have?"}
            </label>
            <textarea 
              rows={3}
              value={questions}
              onChange={e => setQuestions(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary bg-gray-50 text-sm outline-none"
              placeholder={isDeveloper 
                ? (isRTL ? "مثلاً: مواعيد التسليم، أنظمة السداد، موعد المعاينة..." : "E.g., delivery date, payment plans, site visit schedule...") 
                : (isRTL ? "مثلاً: الوحدة في أنهي دور؟ الاستلام إمتا بالظبط؟ ينفع أعاين قبل التنازل؟" : "E.g., floor number, exact delivery date, visit prior to transfer?")}
            />
            <p className="text-xs text-gray-400 mt-1">
              {isRTL ? "أسئلتك بتوصل لفريقنا وبنتابعها معاك بدقة" : "Your questions are shared with our advisors to guide you thoroughly"}
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <label className="block text-sm font-bold text-gray-700">
              {isRTL ? "إنت جاهز للتنفيذ لأي درجة؟" : "How soon are you ready to proceed?"} <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-400 mb-2">
              {isRTL ? "بنرتّب أولوياتنا على الإجابة دي — اختار اللي ينفع معاك فعلاً." : "We prioritize follow-ups based on this — choose what fits your situation."}
            </p>
            
            <label className="flex items-start gap-3 cursor-pointer p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition">
              <input type="radio" name="readiness" required value="ready_48h" onChange={e => setReadiness(e.target.value)} className="mt-1 w-4 h-4 text-primary focus:ring-primary" />
              <span className="text-sm text-gray-700">
                {isRTL 
                  ? "مستعد أستلم مكالمة النهاردة وأحدد معاينة خلال ٤٨ ساعة وجاهز للشراء هذا الأسبوع" 
                  : "Ready for a call today, schedule a visit within 48h, and ready to purchase this week"}
              </span>
            </label>
            
            <label className="flex items-start gap-3 cursor-pointer p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition">
              <input type="radio" name="readiness" required value="ready_3m" onChange={e => setReadiness(e.target.value)} className="mt-1 w-4 h-4 text-primary focus:ring-primary" />
              <span className="text-sm text-gray-700">
                {isRTL ? "جاهز خلال شهر لـ ٣ شهور" : "Ready within 1 to 3 months"}
              </span>
            </label>
            
            <label className="flex items-start gap-3 cursor-pointer p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition">
              <input type="radio" name="readiness" required value="browsing" onChange={e => setReadiness(e.target.value)} className="mt-1 w-4 h-4 text-primary focus:ring-primary" />
              <span className="text-sm text-gray-700">
                {isRTL ? "بتفرّج ومحتاج معلومات" : "Exploring and collecting information"}
              </span>
            </label>
          </div>

          {/* Agreement Checkbox */}
          <div className="pt-3 border-t border-gray-100">
            {isDeveloper ? (
              <label className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  required 
                  checked={agreed} 
                  onChange={e => setAgreed(e.target.checked)} 
                  className="mt-1 w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded flex-shrink-0" 
                />
                <span className="text-sm text-gray-700 leading-snug">
                  {isRTL 
                    ? "أؤكد رغبتي في التواصل لحجز ومعاينة الوحدة مباشرة من المطور."
                    : "I confirm my request to book and inspect the unit directly from the developer."}
                </span>
              </label>
            ) : (
              <label className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  required 
                  checked={agreed} 
                  onChange={e => setAgreed(e.target.checked)} 
                  className="mt-1 w-4 h-4 text-primary focus:ring-primary rounded flex-shrink-0" 
                />
                <span className="text-sm text-gray-600 leading-snug">
                  {isRTL 
                    ? <>أوافق على عمولة بحور العقارية الخاصة بيا كمشتري: 1.25% من قيمة التعاقد ({commission} ج.م) — تُدفع مني أنا فقط عند إتمام التنازل بنجاح. البايع مش بيدفع أي عمولة.</>
                    : <>I agree to Bohoor's 1.25% buyer commission ({commission} EGP), payable only upon successful transfer. The seller pays 0%.</>}
                </span>
              </label>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading || !agreed || !phone || !readiness}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition shadow-md shadow-primary/20"
          >
            {loading ? (isRTL ? "جاري الإرسال..." : "Sending...") : (isRTL ? "تأكيد الطلب" : "Confirm Inquiry")}
          </button>
        </form>
      </div>
    </>
  );
}
