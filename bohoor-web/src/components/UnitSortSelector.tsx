'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function UnitSortSelector({ currentSort }: { currentSort?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newSort === 'default') {
      params.delete('sortBy');
    } else {
      params.set('sortBy', newSort);
    }
    params.set('page', '1');
    router.push(`/units?${params.toString()}`);
  };

  const selectedValue = currentSort || 'default';

  return (
    <select
      name="sortBy"
      value={selectedValue}
      onChange={(e) => handleSortChange(e.target.value)}
      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-primary outline-none cursor-pointer"
    >
      <option value="default">الترتيب الافتراضي للمنصة ⭐</option>
      <option value="highest_roi">أعلى عائد استثماري إيجاري 💰</option>
      <option value="newest">الأحدث مدرجاً 🆕</option>
      <option value="price_asc">المقدم/الكاش: من الأقل للأعلى 📉</option>
      <option value="price_desc">المقدم/الكاش: من الأعلى للأقل 📈</option>
      <option value="total_price_asc">إجمالي السعر: من الأقل للأعلى 🏷️</option>
      <option value="total_price_desc">إجمالي السعر: من الأعلى للأقل 🏷️</option>
      <option value="sea_view_first">إطلالة بحرية أولاً 🌊</option>
      <option value="verified_first">عقارات موثقة أولاً 🛡️</option>
    </select>
  );
}
