'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';

export default function UnitSortSelector({ currentSort }: { currentSort?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

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
      <option value="default">{t('sortDefault')}</option>
      <option value="highest_roi">{t('sortHighestRoi')}</option>
      <option value="newest">{t('sortNewestListed')}</option>
      <option value="price_asc">{t('sortCashAsc')}</option>
      <option value="price_desc">{t('sortCashDesc')}</option>
      <option value="total_price_asc">{t('sortTotalPriceAsc')}</option>
      <option value="total_price_desc">{t('sortTotalPriceDesc')}</option>
      <option value="sea_view_first">{t('sortSeaViewFirst')}</option>
      <option value="verified_first">{t('sortVerifiedFirst')}</option>
    </select>
  );
}
