import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { parseNaturalLanguageQuery, ExtractedFilters } from './ai-parser.util.js';
import { calculateUnitMatch, ScoredUnit } from './matching.engine.js';
import { AiSearchDto } from './dto/ai-search.dto.js';
import * as XLSX from 'xlsx';

@Injectable()
export class AiSearchService {
  constructor(private readonly prisma: PrismaService) {}

  async searchAndMatch(dto: AiSearchDto) {
    const query = dto.query || '';
    const filters = parseNaturalLanguageQuery(query);

    // 1. Fetch Approved Units
    const units = await this.prisma.unit.findMany({
      where: {
        deletedAt: null,
        status: 'APPROVED',
      },
      include: {
        location: true,
        unitType: true,
        developer: true,
        project: true,
      },
    });

    // 2. Score and Match
    const scoredUnits: ScoredUnit[] = units.map((u) => calculateUnitMatch(u, filters));

    // Sort descending by score
    scoredUnits.sort((a, b) => b.matchScore - a.matchScore);

    const topMatches = scoredUnits.slice(0, 10);

    // 3. Persist Search & Top Matches to Database
    let savedSearch: any = null;
    try {
      savedSearch = await this.prisma.userSearch.create({
        data: {
          query,
          userId: dto.userId || null,
          customerName: dto.customerName || null,
          customerPhone: dto.customerPhone || null,
          extractedFilters: filters as any,
          matches: {
            create: topMatches.map((m) => ({
              unitId: m.unit.id,
              matchScore: m.matchScore,
              matchedCriteria: m.matchedCriteria as any,
            })),
          },
        },
        include: {
          matches: true,
        },
      });
    } catch (err) {
      console.error('Error saving user search to database:', err);
    }

    return {
      searchId: savedSearch?.id || null,
      query,
      extractedFilters: filters,
      matches: topMatches.map((m) => ({
        unit: m.unit,
        matchScore: m.matchScore,
        matchedCriteria: m.matchedCriteria,
      })),
    };
  }

  async getAllSearches(limit = 100) {
    return this.prisma.userSearch.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        matches: {
          include: {
            unit: {
              include: {
                location: true,
                unitType: true,
                developer: true,
              },
            },
          },
          orderBy: { matchScore: 'desc' },
          take: 5,
        },
      },
    });
  }

  async exportToExcel(): Promise<Buffer> {
    const searches = await this.prisma.userSearch.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        matches: {
          include: {
            unit: {
              include: {
                location: true,
                unitType: true,
                developer: true,
              },
            },
          },
          orderBy: { matchScore: 'desc' },
        },
      },
    });

    const rows: any[] = [];

    for (const s of searches) {
      const filters = (s.extractedFilters || {}) as ExtractedFilters;
      const topMatch = s.matches[0];
      const dateStr = new Date(s.createdAt).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      if (!topMatch) {
        rows.push({
          'التاريخ': dateStr,
          'اسم العميل': s.customerName || 'عميل غير مسجل',
          'الهاتف': s.customerPhone || '-',
          'نص البحث': s.query,
          'الموقع المطلوب': filters.location || 'غير محدد',
          'الميزانية القصوى': filters.maxPrice ? `${filters.maxPrice.toLocaleString('ar-EG')} ج.م` : 'غير محددة',
          'الغرف المطلوبة': filters.bedrooms ? `${filters.bedrooms} غرف` : 'غير محدد',
          'إطلالة بحر': filters.seaView ? 'نعم' : 'غير محدد',
          'العقار الأفضل تطابقاً': 'لا توجد تطابقات كافية',
          'كود العقار': '-',
          'نسبة التطابق': '-',
          'سعر العقار': '-',
          'موقع العقار الفعلي': '-',
        });
      } else {
        s.matches.slice(0, 3).forEach((m, idx) => {
          const unit = m.unit;
          const uPrice = Number(unit.cashPaidToSeller || unit.totalPrice || unit.originalContractPrice || 0);

          rows.push({
            'التاريخ': dateStr,
            'اسم العميل': s.customerName || (idx === 0 ? 'عميل عبر الويب / التطبيق' : ''),
            'الهاتف': s.customerPhone || '-',
            'نص البحث': idx === 0 ? s.query : `تابع لبحث: ${s.query}`,
            'الموقع المطلوب': filters.location || 'أي موقع',
            'الميزانية القصوى': filters.maxPrice ? `${filters.maxPrice.toLocaleString('ar-EG')} ج.م` : 'مفتوحة',
            'الغرف المطلوبة': filters.bedrooms ? `${filters.bedrooms}` : 'أي عدد',
            'إطلالة بحر': filters.seaView ? 'مطلوبة 🌊' : '-',
            'العقار المتطابق': unit.title,
            'كود العقار': unit.code || unit.id.slice(0, 8),
            'نسبة التطابق': `${m.matchScore}%`,
            'سعر العقار': `${uPrice.toLocaleString('ar-EG')} ج.م`,
            'موقع العقار الفعلي': unit.location?.name || unit.location?.governorate || '-',
            'المطور': unit.developer?.name || (unit.sellerType === 'DEVELOPER' ? 'مطور مباشر' : 'فرد'),
          });
        });
      }
    }

    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!views'] = [{ rightToLeft: true }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'طلبات العملاء وتطابقات AI');

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    return buffer as Buffer;
  }
}
