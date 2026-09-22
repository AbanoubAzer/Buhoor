"use client";

import { useState, useRef } from "react";
import { 
  UserIcon, MapPinIcon, CurrencyDollarIcon, CheckCircleIcon,
  PhotoIcon, VideoCameraIcon, XMarkIcon, ChevronRightIcon, ChevronLeftIcon, CheckIcon
} from "@heroicons/react/24/outline";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Link from "next/link";

export default function AddPropertyPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  
  // Wizard State
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Form Data State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    title: "",
    unitTypeId: "",
    customUnitType: "",
    locationId: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    deliveryStatus: "READY",
    paymentMethod: "cash",
    installmentsCount: "",
    cashPaidToSeller: "",
    originalContractPrice: "",
    description: "",
    isSeaView: false,
    expectedRentalRoi: "",
    nightlyRate: "",
    occupancyDays: "200",
  });

  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [penaltyAgreed, setPenaltyAgreed] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    let val = e.target.value;
    if (e.target.type === 'number') {
      if (val !== '' && Number(val) < 0) {
        val = '0';
      }
    }
    setFormData({ ...formData, [e.target.name]: val });
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!penaltyAgreed) return alert("يرجى الموافقة على شرط غرامة الإلغاء للمتابعة.");
      if (!formData.name || !formData.phone) return alert("يرجى إكمال بيانات التواصل أولاً.");
    }
    if (currentStep === 2) {
      if (!formData.title || !formData.unitTypeId || !formData.locationId || !formData.area) 
        return alert("يرجى إكمال المعلومات الأساسية ذات العلامة الحمراء.");
    }
    if (currentStep === 3) {
      if (formData.paymentMethod === 'cash' && !formData.cashPaidToSeller) return alert("يرجى إدخال السعر المطلوب كاش.");
      if (formData.paymentMethod === 'installment' && (!formData.cashPaidToSeller || !formData.originalContractPrice || !formData.installmentsCount)) 
        return alert("يرجى إدخال إجمالي السعر، المقدم المدفوع، وعدد الأقساط.");
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(curr => curr + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(curr => curr - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const fileToBase64 = (file: File): Promise<{name: string, type: string, base64: string}> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve({ name: file.name, type: file.type, base64: reader.result as string });
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const filesArray: { name: string; mimeType: string; base64: string }[] = [];
      
      if (images.length > 0) {
        const imageBase64Array = await Promise.all(images.map(fileToBase64));
        filesArray.push(...imageBase64Array.map(f => ({ name: f.name, mimeType: f.type, base64: f.base64 })));
      }

      if (videos.length > 0) {
        const videoBase64Array = await Promise.all(videos.map(fileToBase64));
        filesArray.push(...videoBase64Array.map(f => ({ name: f.name, mimeType: f.type, base64: f.base64 })));
      }

      const fullPhone = formData.phone.startsWith('+') ? formData.phone : `+${formData.phone}`;
      
      const unitTypeLabelMap: Record<string, string> = {
        apartment: "شقة",
        villa: "فيلا",
        townhouse: "تاون هاوس",
        chalet: "شاليه",
        studio: "استوديو",
        commercial: "تجاري",
        land: "أرض",
        other: formData.customUnitType?.trim() ? `آخر (${formData.customUnitType.trim()})` : "آخر"
      };

      const resolvedUnitType = unitTypeLabelMap[formData.unitTypeId] || formData.unitTypeId;

      const payload = {
        clientName: formData.name,
        phone: fullPhone,
        location: formData.locationId,
        unitType: resolvedUnitType,
        area: formData.area,
        originalContractPrice: formData.paymentMethod === 'cash' ? formData.cashPaidToSeller : formData.originalContractPrice,
        cashRequired: formData.cashPaidToSeller,
        installmentsCount: formData.installmentsCount,
        paymentMethod: formData.paymentMethod,
        finishingStatus: formData.deliveryStatus,
        nightlyRate: formData.nightlyRate ? `${formData.nightlyRate} ج.م` : "-",
        annualRentalIncome: annualRentalIncome > 0 ? `${annualRentalIncome.toLocaleString('ar-EG')} ج.م` : "-",
        rentalRoi: rentalYieldPercent > 0 ? `${rentalYieldPercent}%` : "-",
        capitalAppreciation: `${appreciationPercent}%`,
        totalRoi: totalRoiPercent > 0 ? `${totalRoiPercent}%` : "-",
        paybackYears: paybackYears ? `${paybackYears} سنة (إيجار كاش)` : "-",
        totalPaybackYears: totalPaybackYears ? `${totalPaybackYears} سنة (إجمالي العائد)` : "-",
        files: filesArray
      };

      await fetch(
        "https://script.google.com/macros/s/AKfycbwm4j0_E7QODiADgwGLiUMPRWlBL7E6Z4fmk8ZVgzffWn5EiUZErnQ0YFJN4J-HYHVNLA/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload),
        }
      );
      
      setSuccess(true);
      setFormData({
        name: "", phone: "", title: "", unitTypeId: "", customUnitType: "", locationId: "", area: "", bedrooms: "", bathrooms: "", deliveryStatus: "READY", paymentMethod: "cash", installmentsCount: "", cashPaidToSeller: "", originalContractPrice: "", description: "", isSeaView: false, expectedRentalRoi: "", nightlyRate: "", occupancyDays: "200"
      });
      setImages([]);
      setVideos([]);
      setCurrentStep(1);
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء إرسال البيانات. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const propertyPrice = parseFloat(
    formData.paymentMethod === 'cash'
      ? formData.cashPaidToSeller
      : (formData.originalContractPrice || formData.cashPaidToSeller || "0")
  ) || 0;

  const nightlyVal = parseFloat(formData.nightlyRate || "0");
  const annualRentalIncome = nightlyVal > 0 ? nightlyVal * 270 : 0;
  const rentalYieldPercent = propertyPrice > 0 && annualRentalIncome > 0
    ? Number(((annualRentalIncome / propertyPrice) * 100).toFixed(1))
    : 0;
  const appreciationPercent = formData.isSeaView ? 30 : 10;
  const annualAppreciationGain = propertyPrice > 0 ? Math.round(propertyPrice * (appreciationPercent / 100)) : 0;
  const totalRoiPercent = rentalYieldPercent > 0
    ? Number((rentalYieldPercent + appreciationPercent).toFixed(1))
    : appreciationPercent;
  const totalAnnualReturnEgp = annualRentalIncome + annualAppreciationGain;
  const paybackYears = (propertyPrice > 0 && annualRentalIncome > 0)
    ? (propertyPrice / annualRentalIncome).toFixed(1)
    : null;
  const totalPaybackYears = totalRoiPercent > 0
    ? (100 / totalRoiPercent).toFixed(1)
    : null;

  const stepTitles = ["معلومات التواصل", "المعلومات الأساسية", "التفاصيل المالية", "الصور والملاحظات"];

  return (
    <div className="bg-[#fcfcfd] min-h-screen pb-20 relative overflow-hidden">
      
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/10 to-transparent -z-10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px] -z-10" />
      <div className="absolute top-20 right-1/4 w-[30rem] h-[30rem] bg-primary/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold font-cairo text-gray-900 mb-4 tracking-tight">
            أضف <span className="text-primary">عقارك</span> مجاناً
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-cairo">
            إن كنت تريد بيع عقارك، منصة بحور هي بوابتك للوصول لآلاف العملاء المهتمين. املأ النموذج في خطوات بسيطة.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-primary/5 border border-white p-6 md:p-12 relative">
          
          {success ? (
            <div className="text-center py-16 animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckIcon className="w-12 h-12 text-green-500 stroke-2" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 font-cairo">تم استلام طلبك بنجاح!</h2>
              <p className="text-gray-500 text-lg mb-8 max-w-lg mx-auto">
                سيتواصل معك أحد مستشارينا العقاريين في أقرب وقت ممكن لمراجعة تفاصيل عقارك وعرضه على المنصة.
              </p>
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => setSuccess(false)}
                  className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-2xl transition shadow-lg shadow-primary/20"
                >
                  إضافة عقار آخر
                </button>
                <Link href="/" className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-8 rounded-2xl transition">
                  العودة للرئيسية
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Progress Stepper */}
              <div className="mb-12 relative">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 rounded-full z-0"></div>
                <div 
                  className="absolute top-1/2 right-0 h-1 bg-primary -translate-y-1/2 rounded-full z-0 transition-all duration-500 ease-out"
                  style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                ></div>
                
                <div className="relative z-10 flex justify-between items-center max-w-2xl mx-auto">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 shadow-sm ${
                        step < currentStep ? 'bg-primary text-white scale-95' : 
                        step === currentStep ? 'bg-white border-2 border-primary text-primary scale-110' : 
                        'bg-white border-2 border-gray-100 text-gray-400'
                      }`}>
                        {step < currentStep ? <CheckIcon className="w-5 h-5 stroke-2" /> : step}
                      </div>
                      <span className={`text-xs font-bold hidden sm:block transition-colors ${step <= currentStep ? 'text-primary' : 'text-gray-400'}`}>
                        {stepTitles[step - 1]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm border border-red-100 mb-8 flex items-center gap-3">
                  <XMarkIcon className="w-5 h-5" />
                  {error}
                </div>
              )}

              <div className="min-h-[400px]">
                {/* Step 1: Contact Info */}
                <div className={`transition-all duration-500 ${currentStep === 1 ? 'opacity-100 translate-x-0' : 'hidden opacity-0 translate-x-8'}`}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 font-cairo">1. من الذي يتواصل معنا؟</h3>
                  
                  <div className="bg-orange-50 border border-orange-200 p-5 rounded-2xl mb-8">
                    <label className="flex items-start gap-4 cursor-pointer">
                      <input type="checkbox" checked={penaltyAgreed} onChange={(e) => setPenaltyAgreed(e.target.checked)} className="mt-1 w-5 h-5 text-accent focus:ring-accent rounded flex-shrink-0" />
                      <span className="text-sm text-gray-800 leading-relaxed font-bold">
                        أوافق وأقر بأنه في حال قيام المنصة بإحضار مشتري جاد وقيامي (كبائع) بالتراجع أو الإلغاء عن قرار البيع، فإنني ملزم بدفع غرامة وقدرها 5000 ج.م كتعويض عن وقت وجهد المنصة.
                      </span>
                    </label>
                  </div>

                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-300 ${!penaltyAgreed ? 'opacity-40 pointer-events-none grayscale-[50%]' : ''}`}>
                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-gray-700">الاسم الكريم <span className="text-red-500">*</span></label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                          <UserIcon className="h-5 w-5" />
                        </div>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="block w-full pl-4 pr-12 py-4 border border-gray-200 rounded-2xl focus:ring-primary focus:border-primary bg-gray-50/50 hover:bg-white focus:bg-white transition outline-none" placeholder="اكتب اسمك الكامل" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-gray-700">رقم الواتساب <span className="text-red-500">*</span></label>
                      <div dir="ltr" className="react-phone-input-container group">
                        <PhoneInput
                          country={'eg'}
                          enableSearch={true}
                          value={formData.phone}
                          onChange={(p) => setFormData({...formData, phone: p})}
                          inputStyle={{ width: '100%', height: '58px', borderRadius: '1rem', borderColor: '#e5e7eb', fontSize: '1rem', backgroundColor: '#f9fafb' }}
                          buttonStyle={{ borderRadius: '1rem 0 0 1rem', borderColor: '#e5e7eb', backgroundColor: '#f9fafb', direction: 'ltr' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2: Basic Details */}
                <div className={`transition-all duration-500 ${currentStep === 2 ? 'opacity-100 translate-x-0' : 'hidden opacity-0 translate-x-8'}`}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 font-cairo">2. تفاصيل العقار</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1 md:col-span-2 space-y-3">
                      <label className="block text-sm font-bold text-gray-700">عنوان الإعلان <span className="text-red-500">*</span></label>
                      <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="block w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-primary focus:border-primary bg-gray-50/50 outline-none" placeholder="مثال: شقة فاخرة للبيع في زايد" />
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-gray-700">نوع الوحدة <span className="text-red-500">*</span></label>
                      <select name="unitTypeId" value={formData.unitTypeId} onChange={handleInputChange} className="block w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-primary focus:border-primary bg-gray-50/50 appearance-none outline-none">
                        <option value="">-- اختر النوع --</option>
                        <option value="apartment">شقة</option>
                        <option value="villa">فيلا</option>
                        <option value="townhouse">تاون هاوس</option>
                        <option value="chalet">شاليه</option>
                        <option value="studio">استوديو</option>
                        <option value="commercial">تجاري</option>
                        <option value="land">أرض</option>
                        <option value="other">آخر</option>
                      </select>

                      {formData.unitTypeId === "other" && (
                        <div className="pt-1">
                          <input
                            type="text"
                            name="customUnitType"
                            value={formData.customUnitType}
                            onChange={handleInputChange}
                            className="block w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:ring-primary focus:border-primary bg-white outline-none text-sm transition-all"
                            placeholder="حدد نوع الوحدة (مثال: بنتهاوس، دوبلكس، عيادة...)"
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-gray-700">المنطقة / الموقع <span className="text-red-500">*</span></label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary">
                          <MapPinIcon className="h-5 w-5" />
                        </div>
                        <input type="text" name="locationId" value={formData.locationId} onChange={handleInputChange} className="block w-full pl-5 pr-12 py-4 border border-gray-200 rounded-2xl focus:ring-primary focus:border-primary bg-gray-50/50 outline-none" placeholder="مثال: التجمع الخامس" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-gray-700">المساحة (م²) <span className="text-red-500">*</span></label>
                      <input type="number" min="1" name="area" value={formData.area} onChange={handleInputChange} className="block w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-primary focus:border-primary bg-gray-50/50 text-left outline-none" dir="ltr" placeholder="150" />
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-gray-700">حالة الاستلام</label>
                      <select name="deliveryStatus" value={formData.deliveryStatus} onChange={handleInputChange} className="block w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-primary focus:border-primary bg-gray-50/50 appearance-none outline-none">
                        <option value="READY">جاهزة (استلام فوري)</option>
                        <option value="UNDER_CONSTRUCTION">تحت الإنشاء</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4 md:col-span-2">
                      <div className="space-y-3">
                        <label className="block text-sm font-bold text-gray-700">غرف النوم</label>
                        <input type="number" min="0" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} className="block w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-primary text-center bg-gray-50/50 outline-none" />
                      </div>
                      <div className="space-y-3">
                        <label className="block text-sm font-bold text-gray-700">الحمامات</label>
                        <input type="number" min="0" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} className="block w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-primary text-center bg-gray-50/50 outline-none" />
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 pt-2">
                      <label className="flex items-center gap-3 p-4 bg-blue-50/70 border border-blue-200 rounded-2xl cursor-pointer hover:bg-blue-100/70 transition">
                        <input 
                          type="checkbox" 
                          name="isSeaView" 
                          checked={formData.isSeaView} 
                          onChange={(e) => setFormData({ ...formData, isSeaView: e.target.checked })} 
                          className="w-5 h-5 text-primary rounded focus:ring-primary" 
                        />
                        <span className="text-sm font-bold text-blue-950 flex items-center gap-2">
                          🌊 إطلالة بحرية / ع البحر مباشرة (Sea View)
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Step 3: Financials */}
                <div className={`transition-all duration-500 ${currentStep === 3 ? 'opacity-100 translate-x-0' : 'hidden opacity-0 translate-x-8'}`}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 font-cairo">3. التفاصيل المالية والعائد الإيجاري</h3>
                  
                  <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 space-y-6">
                    <div className="flex gap-4">
                      <label className={`flex-1 text-center py-4 rounded-2xl cursor-pointer border-2 transition-all font-bold ${formData.paymentMethod === 'cash' ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-gray-500 border-gray-200 hover:border-primary/50'}`}>
                        <input type="radio" name="paymentMethod" value="cash" checked={formData.paymentMethod === 'cash'} onChange={handleInputChange} className="hidden" />
                        دفع كاش
                      </label>
                      <label className={`flex-1 text-center py-4 rounded-2xl cursor-pointer border-2 transition-all font-bold ${formData.paymentMethod === 'installment' ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-gray-500 border-gray-200 hover:border-primary/50'}`}>
                        <input type="radio" name="paymentMethod" value="installment" checked={formData.paymentMethod === 'installment'} onChange={handleInputChange} className="hidden" />
                        أقساط / تنازل
                      </label>
                    </div>

                    {formData.paymentMethod === 'cash' ? (
                      <div className="space-y-3">
                        <label className="block text-sm font-bold text-gray-700">السعر المطلوب كاش (المبلغ كامل) <span className="text-red-500">*</span></label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-accent">
                            <CurrencyDollarIcon className="h-6 w-6" />
                          </div>
                          <input type="number" min="0" name="cashPaidToSeller" value={formData.cashPaidToSeller} onChange={handleInputChange} className="block w-full pl-5 pr-14 py-5 border border-primary/20 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary bg-white text-left font-bold text-2xl text-accent outline-none shadow-inner" dir="ltr" placeholder="0" />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3 md:col-span-2">
                          <label className="block text-sm font-bold text-gray-700">السعر الإجمالي للعقار <span className="text-red-500">*</span></label>
                          <input type="number" min="0" name="originalContractPrice" value={formData.originalContractPrice} onChange={handleInputChange} className="block w-full px-5 py-4 border border-gray-200 rounded-2xl bg-white text-left outline-none focus:ring-primary focus:border-primary font-bold text-lg text-primary" dir="ltr" placeholder="0" />
                        </div>
                        <div className="space-y-3">
                          <label className="block text-sm font-bold text-gray-700">المقدم المطلوب الآن <span className="text-red-500">*</span></label>
                          <input type="number" min="0" name="cashPaidToSeller" value={formData.cashPaidToSeller} onChange={handleInputChange} className="block w-full px-5 py-4 border border-gray-200 rounded-2xl bg-white text-left outline-none focus:ring-primary focus:border-primary font-bold text-lg text-accent" dir="ltr" placeholder="0" />
                        </div>
                        <div className="space-y-3">
                          <label className="block text-sm font-bold text-gray-700">عدد الأقساط المتبقية <span className="text-red-500">*</span></label>
                          <input type="number" min="0" name="installmentsCount" value={formData.installmentsCount} onChange={handleInputChange} className="block w-full px-5 py-4 border border-gray-200 rounded-2xl bg-white text-center outline-none focus:ring-primary focus:border-primary font-bold text-lg" dir="ltr" placeholder="مثال: 24" />
                        </div>
                      </div>
                    )}

                    {/* 📊 حاسبة العائد الاستثماري ونمو رأس المال */}
                    <div className="pt-4 border-t border-primary/10">
                      <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-emerald-50/80 border border-emerald-200/90 p-6 md:p-7 rounded-3xl space-y-5 shadow-xs">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <span className="w-10 h-10 rounded-2xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center text-xl">
                              💎
                            </span>
                            <div>
                              <h4 className="text-base font-extrabold text-emerald-950 font-cairo">
                                حاسبة العائد الاستثماري ونمو قيمة العقار
                              </h4>
                              <p className="text-xs text-emerald-800/80 font-medium">
                                محسوبة على إيجار 270 يوم سنوياً (إشغال 75%) + الارتفاع السنوي في ثمن العقار
                              </p>
                            </div>
                          </div>
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-full border shadow-2xs flex items-center gap-1.5 ${
                            formData.isSeaView 
                              ? 'bg-cyan-100/80 text-cyan-900 border-cyan-300' 
                              : 'bg-emerald-100/80 text-emerald-900 border-emerald-300'
                          }`}>
                            {formData.isSeaView ? '🌊 مشروع سياحي بحري (+30% نمو سنوي)' : '🏢 مشروع عادي (+10% نمو سنوي)'}
                          </span>
                        </div>

                        {/* إدخال سعر الليلة */}
                        <div className="bg-white/90 backdrop-blur p-4 rounded-2xl border border-emerald-200/60 shadow-2xs space-y-2">
                          <label className="block text-xs font-bold text-emerald-950">
                            سعر الليلة المتوقع للإيجار اليومي (ج.م) <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input 
                              type="number" 
                              min="0"
                              name="nightlyRate" 
                              value={formData.nightlyRate} 
                              onChange={(e) => {
                                let val = e.target.value;
                                if (val !== '' && Number(val) < 0) {
                                  val = '0';
                                }
                                const nightly = parseFloat(val || "0");
                                const pPrice = parseFloat(formData.paymentMethod === 'cash' ? formData.cashPaidToSeller : (formData.originalContractPrice || formData.cashPaidToSeller || "0")) || 0;
                                let calcYield = "";
                                if (nightly > 0 && pPrice > 0) {
                                  const annualRental = nightly * 270;
                                  calcYield = ((annualRental / pPrice) * 100).toFixed(1);
                                }
                                setFormData({ ...formData, nightlyRate: val, expectedRentalRoi: calcYield });
                              }}
                              placeholder="مثال: 3500 (أدخل سعر الليلة بالجنيه المصري)" 
                              className="w-full bg-white border border-emerald-300/80 rounded-xl px-4 py-3 text-base font-extrabold text-emerald-900 outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
                              dir="ltr"
                            />
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                              ج.م / ليلة
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 font-medium">
                            💡 متوسط استرشادي: الجونة والساحل الشمالي (3,500 - 8,000+ ج.م) | القاهرة والتجمع وزايد (1,500 - 4,500 ج.م)
                          </p>
                        </div>

                        {/* بطاقات التحليل الاستثماري الفوري */}
                        {parseFloat(formData.nightlyRate || "0") > 0 ? (
                          <div className="space-y-4 pt-1 animate-fadeIn">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-right">
                              {/* 1. الدخل الإيجاري السنوي */}
                              <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-2xs flex flex-col justify-between">
                                <span className="text-[11px] font-bold text-gray-500 block mb-1">
                                  🏡 الدخل الإيجاري السنوي
                                </span>
                                <div>
                                  <span className="text-lg font-black text-emerald-800 block">
                                    {(parseFloat(formData.nightlyRate) * 270).toLocaleString('ar-EG')} ج.م
                                  </span>
                                  <span className="text-[11px] font-bold text-emerald-600 block mt-0.5">
                                    {propertyPrice > 0 && annualRentalIncome > 0 ? `عائد إيجاري ${rentalYieldPercent}% سنوياً` : '270 يوم إشغال (75%)'}
                                  </span>
                                </div>
                              </div>

                              {/* 2. نمو وارتفاع قيمة العقار */}
                              <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-2xs flex flex-col justify-between">
                                <span className="text-[11px] font-bold text-gray-500 block mb-1">
                                  📈 ارتفاع قيمة العقار سنوياً
                                </span>
                                <div>
                                  <span className="text-lg font-black text-blue-800 block">
                                    +{appreciationPercent}% سنوياً
                                  </span>
                                  <span className="text-[11px] font-bold text-blue-600 block mt-0.5">
                                    {propertyPrice > 0 ? `+${annualAppreciationGain.toLocaleString('ar-EG')} ج.م سنوياً` : (formData.isSeaView ? 'مشاريع سياحية بحرية' : 'مشاريع سكنية')}
                                  </span>
                                </div>
                              </div>

                              {/* 3. إجمالي العائد على الاستثمار */}
                              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-4 rounded-2xl shadow-sm flex flex-col justify-between">
                                <span className="text-[11px] font-bold text-emerald-100 block mb-1">
                                  🚀 إجمالي العائد (Total ROI)
                                </span>
                                <div>
                                  <span className="text-xl font-black block">
                                    {rentalYieldPercent > 0 ? `${totalRoiPercent}%` : `${appreciationPercent}%+`}
                                  </span>
                                  <span className="text-[11px] font-semibold text-emerald-100 block mt-0.5">
                                    {propertyPrice > 0 && annualRentalIncome > 0
                                      ? `~${totalAnnualReturnEgp.toLocaleString('ar-EG')} ج.م سنوياً`
                                      : 'العائد الإيجاري + نمو القيمة'}
                                  </span>
                                </div>
                              </div>

                              {/* 4. فترة استرداد رأس المال (الطريقتان معاً) */}
                              <div className="bg-white p-4 rounded-2xl border border-amber-200/90 shadow-2xs flex flex-col justify-between">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-[11px] font-bold text-amber-900 block">
                                    ⏳ استرداد ثمن الوحدة
                                  </span>
                                  <span className="text-[9px] font-extrabold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                                    رؤيتان
                                  </span>
                                </div>
                                {paybackYears ? (
                                  <div className="space-y-1.5">
                                    <div className="flex justify-between items-center bg-amber-50/90 px-2 py-1 rounded-lg border border-amber-200/60">
                                      <span className="text-[10px] font-bold text-amber-900">💵 إيجار كاش:</span>
                                      <span className="text-xs font-black text-amber-800">{paybackYears} سنة</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-emerald-50/90 px-2 py-1 rounded-lg border border-emerald-200/60">
                                      <span className="text-[10px] font-bold text-emerald-950">🚀 إجمالي العائد:</span>
                                      <span className="text-xs font-black text-emerald-700">{totalPaybackYears} سنة</span>
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-xs font-semibold text-gray-400 block py-1">
                                    أدخل سعر العقار لاحتساب المدة
                                  </span>
                                )}
                                <span className="text-[10px] text-gray-400 font-medium block mt-1">
                                  استرداد كاش صافٍ أو إجمالي الأصل
                                </span>
                              </div>
                            </div>

                            {/* النمو التراكمي المركّب لقيمة العقار */}
                            {propertyPrice > 0 && (() => {
                              const r = appreciationPercent / 100;
                              const y1Val = Math.round(propertyPrice * Math.pow(1 + r, 1));
                              const y3Val = Math.round(propertyPrice * Math.pow(1 + r, 3));
                              const y5Val = Math.round(propertyPrice * Math.pow(1 + r, 5));
                              const y1G = Math.round((Math.pow(1 + r, 1) - 1) * 100);
                              const y3G = Math.round((Math.pow(1 + r, 3) - 1) * 100);
                              const y5G = Math.round((Math.pow(1 + r, 5) - 1) * 100);

                              return (
                                <div className="bg-white/80 backdrop-blur border border-emerald-200/80 p-3.5 rounded-2xl space-y-2">
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                                      <span>📈</span> نمو القيمة التراكمي (العائد المركّب {appreciationPercent}% سنوياً):
                                    </span>
                                    <span className="text-[10px] text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded font-bold">
                                      تراكمي
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                    <div className="bg-emerald-50/70 p-2 rounded-xl border border-emerald-100">
                                      <span className="text-[10px] text-gray-500 block">بعد سنة (+{y1G}%)</span>
                                      <span className="font-black text-emerald-900 text-xs block">{y1Val.toLocaleString('ar-EG')} ج</span>
                                    </div>
                                    <div className="bg-blue-50/70 p-2 rounded-xl border border-blue-100">
                                      <span className="text-[10px] text-blue-700 font-bold block">بعد 3 سنوات (+{y3G}%)</span>
                                      <span className="font-black text-blue-950 text-xs block">{y3Val.toLocaleString('ar-EG')} ج</span>
                                    </div>
                                    <div className="bg-emerald-600 text-white p-2 rounded-xl shadow-2xs">
                                      <span className="text-[10px] text-emerald-100 block">بعد 5 سنوات (+{y5G}%)</span>
                                      <span className="font-black text-white text-xs block">{y5Val.toLocaleString('ar-EG')} ج</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}

                            {paybackYears && (
                              <div className="bg-emerald-100/60 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-2xl text-xs space-y-2">
                                <div className="flex items-center gap-1.5 font-bold">
                                  <span>🎯</span>
                                  <span>المعادلة الاستثمارية لاسترداد قيمة الوحدة:</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                                  <div className="bg-white/90 p-2.5 rounded-xl border border-amber-200 shadow-2xs">
                                    <span className="font-bold text-amber-900 block mb-0.5">1. كاش إيجار فقط:</span>
                                    <span>تسترد ثمن الوحدة بالكامل نقدياً في <strong>{paybackYears} سنة</strong> من التأجير اليومي لـ 270 ليلة، مع بقاء العقار كأصل مجاني لك.</span>
                                  </div>
                                  <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-200 shadow-2xs">
                                    <span className="font-bold text-emerald-900 block mb-0.5">2. إجمالي العائد (الأصل + الإيجار):</span>
                                    <span>مع نمو قيمة العقار بنسبة <strong>{appreciationPercent}%</strong> سنوياً، يتضاعف رأس مالك المستثمر خلال <strong>{totalPaybackYears} سنة فقط</strong>!</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-2 text-xs text-emerald-700/80 font-medium">
                            👆 أدخل سعر الليلة المتوقع لتظهر لك فوراً دراسة الجدوى والعائد وفترة استرداد ثمن العقار.
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Step 4: Media & Submission */}
                <div className={`transition-all duration-500 ${currentStep === 4 ? 'opacity-100 translate-x-0' : 'hidden opacity-0 translate-x-8'}`}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 font-cairo">4. الصور والملاحظات النهائية</h3>
                  
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-gray-700">صور العقار <span className="text-gray-400 font-normal text-xs mx-2">(الحد الأقصى 10 صور، مساحة الصورة بحد أقصى 5MB)</span> <span className="text-red-500">*</span></label>
                      <div className="flex justify-center px-6 pt-10 pb-12 border-2 border-gray-200 border-dashed rounded-3xl hover:border-primary hover:bg-primary/5 transition-all cursor-pointer relative group">
                        <div className="space-y-2 text-center">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform">
                            <PhotoIcon className="h-8 w-8 text-primary" />
                          </div>
                          <div className="flex text-sm text-gray-600 justify-center font-medium mt-4">
                            <span className="cursor-pointer text-primary hover:text-accent">
                              <span>اختر الصور من جهازك</span>
                              <input id="imageFiles" type="file" multiple accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => {
                                if (!e.target.files) return;
                                const newFiles = Array.from(e.target.files);
                                const validSizeFiles = newFiles.filter(f => f.size <= 5 * 1024 * 1024);
                                if (validSizeFiles.length < newFiles.length) alert("بعض الصور تتجاوز الحجم المسموح (5MB) وتم استبعادها.");
                                setImages(prev => {
                                  const total = [...prev, ...validSizeFiles];
                                  if (total.length > 10) {
                                    alert("عذراً، الحد الأقصى هو 10 صور فقط.");
                                    return total.slice(0, 10);
                                  }
                                  return total;
                                });
                              }} />
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {images.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-4">
                          {images.map((file, idx) => (
                            <div key={idx} className="relative w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shadow-sm group">
                              <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="preview" />
                              <button type="button" onClick={() => setImages(images.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <XMarkIcon className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-gray-700">فيديو العقار (اختياري) <span className="text-gray-400 font-normal text-xs mx-2">(الحد الأقصى فيديو واحد، الحجم بحد أقصى 20MB)</span></label>
                      <div className="flex justify-center px-6 pt-10 pb-12 border-2 border-gray-200 border-dashed rounded-3xl hover:border-primary hover:bg-primary/5 transition-all cursor-pointer relative group">
                        <div className="space-y-2 text-center">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform">
                            <VideoCameraIcon className="h-8 w-8 text-primary" />
                          </div>
                          <div className="flex text-sm text-gray-600 justify-center font-medium mt-4">
                            <span className="cursor-pointer text-primary hover:text-accent">
                              <span>اختر فيديو من جهازك</span>
                              <input id="videoFiles" type="file" accept="video/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => {
                                if (!e.target.files) return;
                                const file = e.target.files[0];
                                if (!file) return;
                                if (file.size > 20 * 1024 * 1024) {
                                  alert("حجم الفيديو كبير جداً. الحد الأقصى المسموح هو 20MB.");
                                  return;
                                }
                                setVideos([file]); // Always replace with the new single video
                              }} />
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {videos.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-4">
                          {videos.map((file, idx) => (
                            <div key={idx} className="relative bg-gray-100 rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm group">
                              <VideoCameraIcon className="w-5 h-5 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700 max-w-[150px] truncate" dir="ltr">{file.name}</span>
                              <button type="button" onClick={() => setVideos([])} className="text-red-500 hover:text-red-700 transition-colors mr-2">
                                <XMarkIcon className="w-5 h-5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-gray-700">ملاحظات إضافية (اختياري)</label>
                      <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} className="block w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-primary focus:border-primary bg-gray-50/50 outline-none" placeholder="أي تفاصيل أخرى مميزة عن العقار..." />
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="mt-12 flex items-center justify-between pt-8 border-t border-gray-100">
                {currentStep > 1 ? (
                  <button type="button" onClick={prevStep} className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-gray-600 hover:bg-gray-100 transition">
                    <ChevronRightIcon className="w-5 h-5" /> السابق
                  </button>
                ) : <div></div>}

                {currentStep < totalSteps ? (
                  <button type="button" onClick={nextStep} className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-bold transition shadow-lg">
                    الخطوة التالية <ChevronLeftIcon className="w-5 h-5" />
                  </button>
                ) : (
                  <button type="button" onClick={handleSubmit} disabled={loading} className={`flex items-center gap-2 ${loading ? 'bg-primary/70' : 'bg-primary hover:bg-accent'} text-white px-10 py-4 rounded-2xl font-bold transition shadow-xl shadow-primary/30`}>
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin -ml-1 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        جاري الإرسال...
                      </span>
                    ) : (
                      <>إرسال العقار الآن <CheckIcon className="w-5 h-5 stroke-2" /></>
                    )}
                  </button>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
