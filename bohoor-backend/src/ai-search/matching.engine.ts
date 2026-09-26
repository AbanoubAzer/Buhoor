import { ExtractedFilters } from './ai-parser.util.js';

export interface ScoredUnit {
  unit: any;
  matchScore: number;
  matchedCriteria: {
    locationMatch: boolean;
    priceMatch: boolean;
    bedroomsMatch: boolean;
    seaViewMatch: boolean;
    typeMatch: boolean;
  };
}

export function calculateUnitMatch(unit: any, filters: ExtractedFilters): ScoredUnit {
  let score = 0;
  const matchedCriteria = {
    locationMatch: false,
    priceMatch: false,
    bedroomsMatch: false,
    seaViewMatch: false,
    typeMatch: false,
  };

  // 1. Location (Weight: 35 points)
  if (!filters.location) {
    score += 30; // Default baseline if not constrained
    matchedCriteria.locationMatch = true;
  } else {
    const locNames = [
      unit.location?.name,
      unit.location?.nameAr,
      unit.location?.nameEn,
      unit.location?.governorate,
      unit.location?.governorateAr,
      unit.location?.governorateEn,
      unit.title,
      unit.titleAr,
      unit.titleEn,
    ]
      .filter(Boolean)
      .map((s: string) => s.toLowerCase());

    const reqLoc = filters.location.toLowerCase();

    if (locNames.some((locStr: string) => locStr.includes(reqLoc) || reqLoc.includes(locStr))) {
      score += 35;
      matchedCriteria.locationMatch = true;
    } else {
      score += 5;
    }
  }

  // 2. Budget / Price (Weight: 25 points)
  const unitPrice = Number(
    unit.isCashOnly 
      ? (unit.cashPaidToSeller || unit.totalPrice) 
      : (unit.totalPrice || unit.cashPaidToSeller || unit.originalContractPrice || 0)
  );

  if (!filters.maxPrice) {
    score += 25;
    matchedCriteria.priceMatch = true;
  } else if (unitPrice > 0) {
    if (unitPrice <= filters.maxPrice) {
      score += 25;
      matchedCriteria.priceMatch = true;
    } else if (unitPrice <= filters.maxPrice * 1.1) {
      score += 18; // within 10% tolerance
      matchedCriteria.priceMatch = true;
    } else if (unitPrice <= filters.maxPrice * 1.25) {
      score += 10; // within 25% tolerance
    } else {
      score += 2;
    }
  } else {
    score += 15;
  }

  // 3. Bedrooms (Weight: 15 points)
  if (!filters.bedrooms) {
    score += 15;
    matchedCriteria.bedroomsMatch = true;
  } else {
    const unitBeds = Number(unit.bedrooms || 0);
    if (unitBeds === filters.bedrooms) {
      score += 15;
      matchedCriteria.bedroomsMatch = true;
    } else if (Math.abs(unitBeds - filters.bedrooms) === 1) {
      score += 8;
    } else {
      score += 2;
    }
  }

  // 4. Sea View (Weight: 15 points)
  const searchableTexts = [
    unit.location?.name,
    unit.location?.nameAr,
    unit.location?.nameEn,
    unit.title,
    unit.titleAr,
    unit.titleEn,
    unit.description,
    unit.descriptionAr,
    unit.descriptionEn,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const unitHasSea = Boolean(
    unit.isSeaView || 
    searchableTexts.includes('جونة') ||
    searchableTexts.includes('gouna') ||
    searchableTexts.includes('ساحل') ||
    searchableTexts.includes('sahel') ||
    searchableTexts.includes('بحر') ||
    searchableTexts.includes('sea') ||
    searchableTexts.includes('beach') ||
    searchableTexts.includes('شاطئ') ||
    searchableTexts.includes('lagoon') ||
    searchableTexts.includes('لاجون')
  );

  if (filters.seaView) {
    if (unitHasSea) {
      score += 15;
      matchedCriteria.seaViewMatch = true;
    } else {
      score += 3;
    }
  } else {
    score += 12;
    matchedCriteria.seaViewMatch = true;
  }

  // 5. Property Type (Weight: 10 points)
  if (!filters.propertyType) {
    score += 10;
    matchedCriteria.typeMatch = true;
  } else {
    const typeStrings = [
      unit.unitType?.name,
      unit.unitType?.nameAr,
      unit.unitType?.nameEn,
      unit.title,
      unit.titleAr,
      unit.titleEn,
    ]
      .filter(Boolean)
      .map((s: string) => s.toLowerCase());

    const reqType = filters.propertyType.toLowerCase();

    if (typeStrings.some((tStr: string) => tStr.includes(reqType) || reqType.includes(tStr))) {
      score += 10;
      matchedCriteria.typeMatch = true;
    } else {
      score += 3;
    }
  }

  // Ensure score is capped at 100
  const finalScore = Math.min(100, Math.round(score));

  return {
    unit,
    matchScore: finalScore,
    matchedCriteria,
  };
}
