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
    const locName = (unit.location?.name || '').toLowerCase();
    const govName = (unit.location?.governorate || '').toLowerCase();
    const title = (unit.title || '').toLowerCase();
    const reqLoc = filters.location.toLowerCase();

    if (locName.includes(reqLoc) || reqLoc.includes(locName)) {
      score += 35;
      matchedCriteria.locationMatch = true;
    } else if (govName.includes(reqLoc) || reqLoc.includes(govName)) {
      score += 25;
      matchedCriteria.locationMatch = true;
    } else if (title.includes(reqLoc)) {
      score += 30;
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
  const unitHasSea = Boolean(
    unit.isSeaView || 
    unit.location?.name?.includes('جونة') ||
    unit.location?.name?.includes('ساحل') ||
    unit.location?.name?.includes('بحر') ||
    unit.title?.includes('بحر') ||
    unit.title?.includes('شاطئ')
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
    const typeName = (unit.unitType?.name || '').toLowerCase();
    const title = (unit.title || '').toLowerCase();
    const reqType = filters.propertyType.toLowerCase();

    if (typeName.includes(reqType) || title.includes(reqType)) {
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
