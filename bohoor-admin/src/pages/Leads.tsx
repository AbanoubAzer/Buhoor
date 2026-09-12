import { useState } from 'react';

export default function Leads() {
  const [activeTab, setActiveTab] = useState<'sheet1' | 'sheet2'>('sheet1');

  const sheets = {
    sheet1: {
      name: 'الطلبات والاستفسارات (1)',
      url: 'https://docs.google.com/spreadsheets/d/1cC-IO1uMUJ0DF7JOu6xLvXc8-3xPOJdiu2_kqoP-GEI/htmlembed?gid=835859943&widget=true&headers=true'
    },
    sheet2: {
      name: 'الطلبات والاستفسارات (2)',
      url: 'https://docs.google.com/spreadsheets/d/1cC-IO1uMUJ0DF7JOu6xLvXc8-3xPOJdiu2_kqoP-GEI/htmlembed?gid=392586599&widget=true&headers=true'
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] font-arabic">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">طلبات الحجز والاستفسارات</h1>
      </div>

      <div className="bg-white rounded-t-xl border-b border-gray-200 p-2 flex space-x-2 space-x-reverse">
        <button
          onClick={() => setActiveTab('sheet1')}
          className={`px-6 py-3 rounded-lg font-bold text-sm transition ${
            activeTab === 'sheet1' 
              ? 'bg-primary text-white shadow-md' 
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          {sheets.sheet1.name}
        </button>
        <button
          onClick={() => setActiveTab('sheet2')}
          className={`px-6 py-3 rounded-lg font-bold text-sm transition ${
            activeTab === 'sheet2' 
              ? 'bg-primary text-white shadow-md' 
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          {sheets.sheet2.name}
        </button>
      </div>

      <div className="flex-1 bg-white border border-t-0 border-gray-200 rounded-b-xl overflow-hidden relative">
        {/* Loading placeholder */}
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 -z-10">
          <div className="flex flex-col items-center text-gray-400">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-400 rounded-full animate-spin mb-2"></div>
            <p className="text-sm">جاري تحميل البيانات من جوجل...</p>
          </div>
        </div>

        <iframe
          src={sheets[activeTab].url}
          className="w-full h-full border-0 z-10 relative bg-transparent"
          title="Leads Sheet"
        />
      </div>
    </div>
  );
}
