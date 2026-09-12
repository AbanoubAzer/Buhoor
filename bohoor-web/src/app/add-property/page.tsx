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
  });

  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [penaltyAgreed, setPenaltyAgreed] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      
      const payload = {
        clientName: formData.name,
        phone: fullPhone,
        location: formData.locationId,
        unitType: formData.unitTypeId,
        area: formData.area,
        originalContractPrice: formData.paymentMethod === 'cash' ? formData.cashPaidToSeller : formData.originalContractPrice,
        cashRequired: formData.cashPaidToSeller,
        installmentsCount: formData.installmentsCount,
        paymentMethod: formData.paymentMethod,
        finishingStatus: formData.deliveryStatus,
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
        name: "", phone: "", title: "", unitTypeId: "", locationId: "", area: "", bedrooms: "", bathrooms: "", deliveryStatus: "READY", paymentMethod: "cash", installmentsCount: "", cashPaidToSeller: "", originalContractPrice: "", description: ""
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
                        <option value="commercial">تجاري</option>
                        <option value="land">أرض</option>
                        <option value="chalet">شاليه</option>
                      </select>
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
                      <input type="number" name="area" value={formData.area} onChange={handleInputChange} className="block w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-primary focus:border-primary bg-gray-50/50 text-left outline-none" dir="ltr" placeholder="150" />
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
                        <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} className="block w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-primary text-center bg-gray-50/50 outline-none" />
                      </div>
                      <div className="space-y-3">
                        <label className="block text-sm font-bold text-gray-700">الحمامات</label>
                        <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} className="block w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-primary text-center bg-gray-50/50 outline-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3: Financials */}
                <div className={`transition-all duration-500 ${currentStep === 3 ? 'opacity-100 translate-x-0' : 'hidden opacity-0 translate-x-8'}`}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 font-cairo">3. التفاصيل المالية</h3>
                  
                  <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10">
                    <div className="mb-8 flex gap-4">
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
                          <input type="number" name="cashPaidToSeller" value={formData.cashPaidToSeller} onChange={handleInputChange} className="block w-full pl-5 pr-14 py-5 border border-primary/20 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary bg-white text-left font-bold text-2xl text-accent outline-none shadow-inner" dir="ltr" placeholder="0" />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3 md:col-span-2">
                          <label className="block text-sm font-bold text-gray-700">السعر الإجمالي للعقار <span className="text-red-500">*</span></label>
                          <input type="number" name="originalContractPrice" value={formData.originalContractPrice} onChange={handleInputChange} className="block w-full px-5 py-4 border border-gray-200 rounded-2xl bg-white text-left outline-none focus:ring-primary focus:border-primary font-bold text-lg text-primary" dir="ltr" placeholder="0" />
                        </div>
                        <div className="space-y-3">
                          <label className="block text-sm font-bold text-gray-700">المقدم المطلوب الآن <span className="text-red-500">*</span></label>
                          <input type="number" name="cashPaidToSeller" value={formData.cashPaidToSeller} onChange={handleInputChange} className="block w-full px-5 py-4 border border-gray-200 rounded-2xl bg-white text-left outline-none focus:ring-primary focus:border-primary font-bold text-lg text-accent" dir="ltr" placeholder="0" />
                        </div>
                        <div className="space-y-3">
                          <label className="block text-sm font-bold text-gray-700">عدد الأقساط المتبقية <span className="text-red-500">*</span></label>
                          <input type="number" name="installmentsCount" value={formData.installmentsCount} onChange={handleInputChange} className="block w-full px-5 py-4 border border-gray-200 rounded-2xl bg-white text-center outline-none focus:ring-primary focus:border-primary font-bold text-lg" dir="ltr" placeholder="مثال: 24" />
                        </div>
                      </div>
                    )}
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
