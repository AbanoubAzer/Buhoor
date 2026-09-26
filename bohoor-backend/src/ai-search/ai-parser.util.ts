export interface ExtractedFilters {
  location?: string;
  propertyType?: string;
  bedrooms?: number;
  maxPrice?: number;
  minPrice?: number;
  seaView?: boolean;
  isCashOnly?: boolean;
  rawKeywords?: string[];
}

export function parseNaturalLanguageQuery(query: string): ExtractedFilters {
  if (!query || typeof query !== 'string') {
    return {};
  }

  const q = query.trim().toLowerCase();
  const filters: ExtractedFilters = {};
  const keywords: string[] = [];

  // 1. Sea View
  const seaKeywords = [
    'sea view', 'seaview', 'beach', 'beachfront', 'first row', 'ocean view', 'lagoon',
    'بحر', 'على البحر', 'إطلالة بحر', 'اطلالة بحرية', 'فيو بحر', 'صف أول', 'شاطئ', 'لاجون'
  ];
  if (seaKeywords.some(keyword => q.includes(keyword))) {
    filters.seaView = true;
    keywords.push('إطلالة بحرية');
  }

  // 2. Location
  const locationMap: Record<string, string[]> = {
    'سهل حشيش': ['sahl hasheesh', 'sahl hashish', 'hasheesh', 'سهل حشيش'],
    'الجونة': ['gouna', 'el gouna', 'el-gouna', 'الجونة', 'الجونه'],
    'الغردقة': ['hurghada', 'hurgada', 'الغردقة', 'الغردقه'],
    'الساحل الشمالي': ['north coast', 'sahel', 'marassi', 'ras el hekma', 'الساحل', 'الساحل الشمالي', 'رأس الحكمة'],
    'القاهرة الجديدة': ['new cairo', 'tagamoa', 'tagamo3', 'fifth settlement', 'القاهرة الجديدة', 'التجمع', 'التجمع الخامس'],
    'الشيخ زايد': ['zayed', 'sheikh zayed', 'زايد', 'الشيخ زايد'],
    '6 أكتوبر': ['october', '6th of october', 'أكتوبر', 'اكتوبر'],
    'العين السخنة': ['sokhna', 'ain sokhna', 'السخنة', 'العين السخنة'],
    'شرم الشيخ': ['sharm', 'sharm el sheikh', 'شرم', 'شرم الشيخ'],
    'سوما باي': ['soma bay', 'somabay', 'سوما باي'],
    'مكادي باي': ['makadi', 'makadi bay', 'مكادي'],
  };

  for (const [canonicalLocation, aliases] of Object.entries(locationMap)) {
    if (aliases.some(alias => q.includes(alias))) {
      filters.location = canonicalLocation;
      keywords.push(canonicalLocation);
      break;
    }
  }

  // 3. Property Type
  const typeMap: Record<string, string[]> = {
    'شاليه': ['chalet', 'شاليه', 'شاليهات'],
    'شقة': ['apartment', 'flat', 'شقة', 'شقه', 'شقق'],
    'فيلا': ['villa', 'standalone', 'فيلا', 'فلل'],
    'دوبلكس': ['duplex', 'دوبلكس'],
    'تاون هاوس': ['townhouse', 'town house', 'تاون هاوس', 'تاون'],
    'توين هاوس': ['twinhouse', 'twin house', 'توين هاوس', 'توين'],
    'بنتهاوس': ['penthouse', 'بنتهاوس', 'روف'],
    'استوديو': ['studio', 'استوديو', 'استوديو'],
  };

  for (const [canonicalType, aliases] of Object.entries(typeMap)) {
    if (aliases.some(alias => q.includes(alias))) {
      filters.propertyType = canonicalType;
      keywords.push(canonicalType);
      break;
    }
  }

  // 4. Bedrooms
  if (q.includes('استوديو') || q.includes('studio')) {
    filters.bedrooms = 1;
  } else if (q.includes('غرفتين') || q.includes('2 bed') || q.includes('2bed') || q.includes('2 room') || q.includes('2 غرف')) {
    filters.bedrooms = 2;
  } else if (q.includes('غرفة واحدة') || q.includes('غرفة') || q.includes('1 bed') || q.includes('1bed') || q.includes('1 room')) {
    filters.bedrooms = 1;
  } else if (q.includes('3 غرف') || q.includes('3 bed') || q.includes('3bed') || q.includes('3 room')) {
    filters.bedrooms = 3;
  } else if (q.includes('4 غرف') || q.includes('4 bed') || q.includes('4bed') || q.includes('4 room')) {
    filters.bedrooms = 4;
  } else {
    // Regex for: "X bed", "X bedrooms", "X غرف"
    const bedMatch = q.match(/(\d+)\s*(?:bed|bedroom|bedrooms|rooms?|غرف|غرفة)/i);
    if (bedMatch && bedMatch[1]) {
      const b = parseInt(bedMatch[1], 10);
      if (b > 0 && b < 15) {
        filters.bedrooms = b;
      }
    }
  }
  if (filters.bedrooms) {
    keywords.push(`${filters.bedrooms} غرف`);
  }

  // 5. Max Price / Budget
  // Handle "X M", "X million", "X مليون", "X k", "X000000"
  // Examples: "max 5m", "budget 5.5 million", "5 مليون", "أقل من 4 مليون", "تحت 6m"
  const millionMatch = q.match(/(?:max|budget|under|less than|up to|حد أقصى|ميزانية|أقل من|تحت|سعر|بحدود)?\s*(\d+(?:\.\d+)?)\s*(?:m|million|م|مليون)\b/i);
  if (millionMatch && millionMatch[1]) {
    const num = parseFloat(millionMatch[1]);
    if (num > 0) {
      filters.maxPrice = Math.round(num * 1000000);
    }
  } else {
    // Check thousands "X k" or "X الف"
    const thousandMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:k|thousand|الف|ألف)\b/i);
    if (thousandMatch && thousandMatch[1]) {
      const num = parseFloat(thousandMatch[1]);
      if (num > 0) {
        filters.maxPrice = Math.round(num * 1000);
      }
    } else {
      // Check direct number e.g. 5000000
      const exactNumberMatch = q.match(/(\d{6,10})/);
      if (exactNumberMatch && exactNumberMatch[1]) {
        filters.maxPrice = parseInt(exactNumberMatch[1], 10);
      }
    }
  }

  if (filters.maxPrice) {
    keywords.push(`ميزانية حتى ${filters.maxPrice.toLocaleString('ar-EG')} ج.م`);
  }

  // 6. Cash vs Installments
  if (q.includes('كاش فقط') || (q.includes('كاش') && !q.includes('تقسيط')) || q.includes('cash only')) {
    filters.isCashOnly = true;
    keywords.push('كاش');
  } else if (q.includes('تقسيط') || q.includes('قسط') || q.includes('installment')) {
    filters.isCashOnly = false;
    keywords.push('تقسيط');
  }

  filters.rawKeywords = keywords;
  return filters;
}
