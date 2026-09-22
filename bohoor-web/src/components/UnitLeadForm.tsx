"use client";

import { useState } from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export default function UnitLeadForm({ unitPrice, unitId }: { unitPrice: number, unitId: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [questions, setQuestions] = useState("");
  const [readiness, setReadiness] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Calculate 1.25% commission
  const commission = unitPrice ? (unitPrice * 0.0125).toLocaleString() : "0";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        action: "NEW_LEAD",
        unitId: window.location.href,
        name,
        phone: phone.startsWith('+') ? phone : `+${phone}`,
        readiness,
        questions,
        commission
      };

      await fetch(
        "https://script.google.com/macros/s/AKfycbwm4j0_E7QODiADgwGLiUMPRWlBL7E6Z4fmk8ZVgzffWn5EiUZErnQ0YFJN4J-HYHVNLA/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify(payload),
        }
      );

      setSuccess(true);
    } catch (error: any) {
      console.error(error);
      alert(`حدث خطأ أثناء الإرسال: ${error?.message || "يرجى المحاولة مرة أخرى."}`);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 p-6 rounded-3xl text-center border border-green-100">
        <h3 className="text-xl font-bold text-green-600 mb-2">تم استلام طلبك بنجاح!</h3>
        <p className="text-green-700">سيقوم فريقنا بالتواصل معك في أقرب وقت.</p>
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-bold text-primary">جاري إرسال طلبك...</p>
        </div>
      )}
      
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
      <h3 className="text-xl font-bold text-primary mb-2">عايز تلحق تحجز الفرصة ديه؟</h3>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        سيب اسمك ورقم الواتساب، وفريقنا هيكلّمك يراجع معاك.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label className="block text-sm font-bold text-gray-700">الاسم <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            required 
            value={name}
            onChange={e => setName(e.target.value)}
            className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary bg-gray-50 text-sm outline-none" 
            placeholder="الاسم الكامل" 
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-bold text-gray-700">رقم الواتساب <span className="text-red-500">*</span></label>
          <div dir="ltr">
            <PhoneInput
              country={'eg'}
              enableSearch={true}
              searchPlaceholder="البحث عن الدولة..."
              value={phone}
              onChange={(p) => setPhone(p)}
              inputStyle={{ width: '100%', height: '48px', borderRadius: '0.75rem', borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}
              buttonStyle={{ borderRadius: '0.75rem 0 0 0.75rem', borderColor: '#e5e7eb', backgroundColor: '#f9fafb', direction: 'ltr' }}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-bold text-gray-700">إيه الأسئلة أو الطلبات اللي عايز تسألها للبايع ومش موضحة في الإعلان؟</label>
          <textarea 
            rows={3}
            value={questions}
            onChange={e => setQuestions(e.target.value)}
            className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary bg-gray-50 text-sm outline-none"
            placeholder="مثلاً: الوحدة في أنهي دور؟ الاستلام إمتاي بالظبط؟ ينفع أعاين قبل التنازل؟ فيه متأخرات على الوحدة؟"
          />
<p className="text-xs text-gray-400 mt-1">أسئلتك بتوصل لفريقنا وإحنا بنسألها للبايع ونرجعلك بالرد</p>        </div>

        <div className="space-y-3">
          <label className="block text-sm font-bold text-gray-700">إنت جاهز للتنفيذ لأي درجة؟ <span className="text-red-500">*</span></label>
          <p className="text-xs text-gray-400 mb-2">بنرتّب أولوياتنا على الإجابة دي — اختار اللي ينفع معاك فعلاً، مش الأسرع.</p>
          
          <label className="flex items-start gap-3 cursor-pointer p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition">
            <input type="radio" name="readiness" required value="ready_48h" onChange={e => setReadiness(e.target.value)} className="mt-1 w-4 h-4 text-primary focus:ring-primary" />
            <span className="text-sm text-gray-700">مستعد أستلم مكالمة النهاردة وأحدد معاينة خلال ٤٨ ساعة وجاهز لاتمام عملية الشراء في هذا الأسبوع</span>
          </label>
          
          <label className="flex items-start gap-3 cursor-pointer p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition">
            <input type="radio" name="readiness" required value="ready_3m" onChange={e => setReadiness(e.target.value)} className="mt-1 w-4 h-4 text-primary focus:ring-primary" />
            <span className="text-sm text-gray-700">جاهز خلال شهر لـ ٣ شهور</span>
          </label>
          
          <label className="flex items-start gap-3 cursor-pointer p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition">
            <input type="radio" name="readiness" required value="browsing" onChange={e => setReadiness(e.target.value)} className="mt-1 w-4 h-4 text-primary focus:ring-primary" />
            <span className="text-sm text-gray-700">بتفرّج ومحتاج معلومات</span>
          </label>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" required checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-1 w-4 h-4 text-primary focus:ring-primary rounded flex-shrink-0" />
            <span className="text-sm text-gray-600 leading-snug">
              أوافق على عمولة بحور العقارية الخاصة بيا كمشتري: 1.25% من قيمة التعاقد ({commission} ج.م) — تُدفع مني أنا فقط عند إتمام التنازل بنجاح. البايع مش بيدفع أي عمولة.
            </span>
          </label>
        </div>

        <button 
          type="submit" 
          disabled={loading || !agreed || !phone || !readiness}
          className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition shadow-md shadow-primary/20"
        >
          {loading ? "جاري الإرسال..." : "تأكيد الطلب"}
        </button>
      </form>
    </div>
    </>
  );
}
