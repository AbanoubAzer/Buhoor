import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto.js';
import { UpdateUnitDto } from './dto/update-unit.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import * as XLSX from 'xlsx';

@Injectable()
export class UnitsService {
  constructor(private readonly prisma: PrismaService) { }

  async importExcel(file: any, projectId?: string) {
    if (!file) throw new BadRequestException('No file provided');

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Auto-detect the real header row (skip title/logo rows)
    // Scan the first 15 rows to find one where cells contain recognizable column names
    const knownHeaders = ['unit', 'code', 'price', 'area', 'status', 'type', 'building', 'phase', 'bedroom', 'bathroom', 'floor',
      'كود', 'رقم', 'وحدة', 'السعر', 'المساحة', 'الحالة', 'نوع', 'المبنى', 'غرف'];
    let headerRowIndex = 0;
    const rawRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
    for (let i = 0; i < Math.min(15, rawRows.length); i++) {
      const row = rawRows[i];
      if (!row || !Array.isArray(row)) continue;
      const cellValues = row.map(c => String(c || '').trim().toLowerCase());
      const matchCount = cellValues.filter(v => v && knownHeaders.some(kh => v.includes(kh))).length;
      if (matchCount >= 2) {
        headerRowIndex = i;
        break;
      }
    }

    const rows = XLSX.utils.sheet_to_json(worksheet, { range: headerRowIndex }) as any[];

    console.log('[IMPORT DEBUG] headerRowIndex:', headerRowIndex);
    console.log('[IMPORT DEBUG] totalRows:', rows.length);
    console.log('[IMPORT DEBUG] firstRowKeys:', rows.length > 0 ? Object.keys(rows[0]) : 'NO ROWS');
    console.log('[IMPORT DEBUG] firstRow:', rows.length > 0 ? JSON.stringify(rows[0]).substring(0, 500) : 'NO ROWS');

    let updated = 0;
    let created = 0;
    let notFound = 0;

    let project = null;
    let locationId = null;

    if (projectId) {
      project = await this.prisma.project.findUnique({ where: { id: projectId } });
      if (project) {
        const locName = project.location || 'Unknown';
        let loc = await this.prisma.location.findFirst({ where: { name: { equals: locName, mode: 'insensitive' } } });
        if (!loc) {
          loc = await this.prisma.location.create({ data: { name: locName } });
        }
        locationId = loc.id;
      }
    }

    console.log('[IMPORT DEBUG] projectId:', projectId, 'project:', project?.id, 'locationId:', locationId);

    const unitTypes = await this.prisma.unitTypeModel.findMany();
    const getUnitTypeId = async (typeName: string) => {
      let tName = typeName ? String(typeName).trim() : 'Apartment';
      if (!tName) tName = 'Apartment';
      let ut = unitTypes.find(u => u.name.toLowerCase() === tName.toLowerCase());
      if (!ut) {
        ut = await this.prisma.unitTypeModel.create({ data: { name: tName } });
        unitTypes.push(ut);
      }
      return ut.id;
    };

    // Auto-detect column headers from the first row
    const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
    const findCol = (...patterns: string[]) =>
      headers.find(h => {
        const lower = h.trim().toLowerCase().replace(/[_.]/g, ' ').replace(/\s+/g, ' ').trim();
        return patterns.some(p => lower === p || lower.includes(p));
      });

    // Detect columns — order matters: more specific patterns first
    const colCode = findCol('unit no', 'unit code', 'رقم الوحدة', 'كود');
    const colStatus = findCol('status', 'الحالة');
    const colPrice = findCol('price', 'السعر', 'total price');
    const colArea = findCol('area', 'المساحة', 'مساحة');
    const colBuilding = findCol('building', 'المبنى');
    const colUnitType = findCol('unit type', 'نوع الوحدة', 'نوع', 'type');
    const colBedrooms = findCol('bedrooms', 'bedroom', 'bed', 'غرف');
    const colBathrooms = findCol('bathrooms', 'bathroom', 'bath', 'حمام');
    const colFloor = findCol('floor', 'الدور', 'طابق');
    const colView = findCol('view', 'الإطلالة', 'إطلالة', 'اطلالة');
    const colPhase = findCol('phase', 'المرحلة');
    const colGarden = findCol('garden', 'حديقة');

    console.log('[IMPORT DEBUG] headers:', headers);
    console.log('[IMPORT DEBUG] detectedColumns:', { colCode, colStatus, colPrice, colArea, colBuilding, colUnitType, colFloor, colView, colPhase });

    let skipped = 0;

    for (const row of rows) {
      const unitCode = colCode ? row[colCode] : undefined;
      if (!unitCode) { skipped++; continue; }

      const rawStatus = String((colStatus ? row[colStatus] : '') || '').toLowerCase().trim();
      let status = undefined;
      if (rawStatus === 'hold') status = 'HIDDEN';
      else if (rawStatus === 'sold') status = 'SOLD';
      else if (rawStatus === 'available') status = 'APPROVED';

      const price = colPrice ? row[colPrice] : undefined;
      let totalPrice: number | undefined = undefined;
      if (price) {
        let totalStr = String(price).replace(/,/g, '').trim();
        let parsed = parseFloat(totalStr);
        if (!isNaN(parsed) && parsed > 0) totalPrice = parsed;
      }

      let areaVal: number = 0;
      const area = colArea ? row[colArea] : undefined;
      if (area) {
        let aStr = String(area).replace(/,/g, '').trim();
        let parsed = parseFloat(aStr);
        if (!isNaN(parsed) && parsed > 0) areaVal = parsed;
      }

      const building = colBuilding ? String(row[colBuilding] || '').trim() : '';
      const unitTypeName = colUnitType ? String(row[colUnitType] || '').trim() : '';
      const phase = colPhase ? String(row[colPhase] || '').trim() : '';

      const bedroomsVal = colBedrooms ? parseInt(String(row[colBedrooms] || '0'), 10) : 0;
      const bathroomsVal = colBathrooms ? parseInt(String(row[colBathrooms] || '0'), 10) : 0;
      const floorVal = colFloor ? row[colFloor] : undefined;
      const viewVal = colView ? String(row[colView] || '').trim() : '';

      let rawCode = String(unitCode).trim();
      // Use short project prefix for cleaner codes (e.g. "CRS-CF-105" instead of "CLAN-RESIDENTS-RED-SEA-CF - 105")
      const shortPrefix = project?.slug
        ? project.slug.split('-').map((w: string) => w[0]?.toUpperCase()).join('').substring(0, 4)
        : project?.id?.substring(0, 4).toUpperCase() || '';
      let scopedCode = project ? `${shortPrefix}-${rawCode}` : rawCode;

      // Extract garden value if present
      const gardenVal = colGarden ? String(row[colGarden] || '').trim() : '';
      const hasGarden = Boolean(
        gardenVal &&
        gardenVal !== '0' &&
        gardenVal.toLowerCase() !== 'false' &&
        gardenVal.toLowerCase() !== 'no' &&
        gardenVal.toLowerCase() !== 'null'
      );

      // Generate attractive Arabic title according to format:
      // [نوع الوحدة] [عدد الغرف] + [الميزة الأساسية] في [المشروع] – [الموقع]
      const projectName = project?.nameAr || project?.name || '';
      const projectLocation = project?.locationAr || project?.location || '';

      // 1. Determine Arabic unit type label
      let typeLabel = 'شاليه';
      const lowerType = (unitTypeName || '').toLowerCase();
      if (lowerType.includes('studio') || lowerType.includes('ستوديو')) {
        typeLabel = 'ستوديو';
      } else if (lowerType.includes('villa') || lowerType.includes('فيلا')) {
        typeLabel = 'فيلا';
      } else if (lowerType.includes('duplex') || lowerType.includes('دوبلكس')) {
        typeLabel = 'دوبلكس';
      } else if (lowerType.includes('penthouse') || lowerType.includes('بنتهاوس')) {
        typeLabel = 'بنتهاوس';
      } else if (lowerType.includes('apartment') || lowerType.includes('شقة')) {
        const isCoastal = (projectLocation || '').includes('الغردقة') || (projectLocation || '').includes('مجاويش') || (projectLocation || '').includes('بحر') || (projectLocation || '').includes('ساحل') || (projectLocation || '').includes('سخنة');
        typeLabel = isCoastal ? 'شاليه' : 'شقة';
      } else {
        const isCoastal = (projectLocation || '').includes('الغردقة') || (projectLocation || '').includes('مجاويش') || (projectLocation || '').includes('بحر') || (projectLocation || '').includes('ساحل') || (projectLocation || '').includes('سخنة');
        typeLabel = isCoastal ? 'شاليه' : 'شقة';
      }

      // 2. Room text
      let roomText = '';
      if (typeLabel !== 'ستوديو') {
        if (bedroomsVal === 1) roomText = '1 غرفة';
        else if (bedroomsVal === 2) roomText = '2 غرفة';
        else if (bedroomsVal > 2) roomText = `${bedroomsVal} غرف`;
        else if (lowerType.includes('1 bed') || lowerType.includes('1-bed')) roomText = '1 غرفة';
        else if (lowerType.includes('2 bed') || lowerType.includes('2-bed')) roomText = '2 غرفة';
        else if (lowerType.includes('3 bed') || lowerType.includes('3-bed')) roomText = '3 غرف';
      }

      // 3. Primary feature
      let featureText = 'للبيع';
      const lowerView = (viewVal || '').toLowerCase();
      if (hasGarden || lowerView.includes('garden') || lowerView.includes('حديقة')) {
        featureText = 'بحديقة خاصة';
      } else if (lowerView.includes('sea') || lowerView.includes('بحر') || lowerView.includes('مباشر')) {
        featureText = 'بإطلالة بحرية';
      } else if (lowerView.includes('pool') || lowerView.includes('حمام سباحة') || lowerView.includes('سباحة')) {
        featureText = 'بإطلالة على حمام السباحة';
      } else if (viewVal && viewVal.trim()) {
        featureText = `بإطلالة ${viewVal.trim()}`;
      }

      // 4. Combine title: [نوع الوحدة] [عدد الغرف] [الميزة الأساسية] في [المشروع] – [الموقع]
      const titlePartsAr = [typeLabel];
      if (roomText) titlePartsAr.push(roomText);
      titlePartsAr.push(featureText);

      let titleAr = titlePartsAr.join(' ');
      if (projectName) titleAr += ` في ${projectName}`;
      if (projectLocation) titleAr += ` – ${projectLocation}`;
      if (rawCode) titleAr += ` (${rawCode})`;

      // English Title Generation
      const projectNameEn = project?.nameEn || project?.name || '';
      const projectLocationEn = project?.locationEn || project?.location || '';

      let typeLabelEn = 'Chalet';
      if (typeLabel === 'ستوديو') typeLabelEn = 'Studio';
      else if (typeLabel === 'فيلا') typeLabelEn = 'Villa';
      else if (typeLabel === 'شقة') typeLabelEn = 'Apartment';

      let roomTextEn = '';
      if (typeLabelEn !== 'Studio') {
        if (bedroomsVal > 0) roomTextEn = `${bedroomsVal} Bed`;
      }

      let featureTextEn = 'for Sale';
      if (hasGarden || lowerView.includes('garden')) featureTextEn = 'with Private Garden';
      else if (lowerView.includes('sea')) featureTextEn = 'with Sea View';
      else if (lowerView.includes('pool')) featureTextEn = 'with Pool View';
      else if (viewVal && viewVal.trim()) featureTextEn = `with ${viewVal.trim()}`;

      const titlePartsEn = [];
      if (roomTextEn) titlePartsEn.push(roomTextEn);
      titlePartsEn.push(typeLabelEn);
      titlePartsEn.push(featureTextEn);

      let titleEn = titlePartsEn.join(' ');
      if (projectNameEn) titleEn += ` in ${projectNameEn}`;
      if (projectLocationEn) titleEn += ` – ${projectLocationEn}`;
      if (rawCode) titleEn += ` (${rawCode})`;

      const title = titleAr;

      // Generate rich Arabic description
      let descLines: string[] = [];
      descLines.push(`✨ ${typeLabel} ${roomText ? `${roomText} ` : ''}${featureText}${projectName ? ` في مشروع ${projectName}` : ''}`);
      descLines.push('');
      if (projectLocation) descLines.push(`📍 الموقع: ${projectLocation}`);
      descLines.push(`🏷️ رقم الوحدة: ${rawCode}`);
      if (projectName) descLines.push(`🏗️ المشروع: ${projectName}`);
      if (building) descLines.push(`🏢 المبنى: ${building}`);
      if (floorVal !== undefined && floorVal !== null && floorVal !== '') descLines.push(`🔢 الدور: ${floorVal}`);
      if (areaVal > 0) descLines.push(`📐 المساحة: ${areaVal} م²`);
      if (bedroomsVal > 0) descLines.push(`🛏️ الغرف: ${bedroomsVal}`);
      if (bathroomsVal > 0) descLines.push(`🚿 الحمامات: ${bathroomsVal}`);
      if (hasGarden) descLines.push(`🏡 الميزات: حديقة خاصة`);
      if (viewVal) descLines.push(`🌊 الإطلالة: ${viewVal}`);
      if (phase) descLines.push(`📋 المرحلة: ${phase}`);
      if (totalPrice) descLines.push(`💰 السعر الإجمالي: ${totalPrice.toLocaleString('ar-EG')} جنيه مصري`);
      descLines.push('');
      descLines.push('🔑 فرصة استثمارية مميزة بعائد مضمون وموقع استراتيجي. تواصل معنا الآن لمزيد من التفاصيل والمعاينة!');
      const descriptionAr = descLines.join('\n');

      // Generate English description
      let descLinesEn: string[] = [];
      descLinesEn.push(`✨ ${roomTextEn ? `${roomTextEn} ` : ''}${typeLabelEn} ${featureTextEn}${projectNameEn ? ` in ${projectNameEn}` : ''}`);
      descLinesEn.push('');
      if (projectLocationEn) descLinesEn.push(`📍 Location: ${projectLocationEn}`);
      descLinesEn.push(`🏷️ Unit Code: ${rawCode}`);
      if (projectNameEn) descLinesEn.push(`🏗️ Project: ${projectNameEn}`);
      if (building) descLinesEn.push(`🏢 Building: ${building}`);
      if (floorVal !== undefined && floorVal !== null && floorVal !== '') descLinesEn.push(`🔢 Floor: ${floorVal}`);
      if (areaVal > 0) descLinesEn.push(`📐 Area: ${areaVal} m²`);
      if (bedroomsVal > 0) descLinesEn.push(`🛏️ Bedrooms: ${bedroomsVal}`);
      if (bathroomsVal > 0) descLinesEn.push(`🚿 Bathrooms: ${bathroomsVal}`);
      if (hasGarden) descLinesEn.push(`🏡 Features: Private Garden`);
      if (viewVal) descLinesEn.push(`🌊 View: ${viewVal}`);
      if (phase) descLinesEn.push(`📋 Phase: ${phase}`);
      if (totalPrice) descLinesEn.push(`💰 Total Price: ${totalPrice.toLocaleString()} EGP`);
      descLinesEn.push('');
      descLinesEn.push('🔑 Exceptional investment opportunity in a prime location. Contact us now for details and viewings!');
      const descriptionEn = descLinesEn.join('\n');

      let updateData: any = {};
      if (status) updateData.status = status;
      if (totalPrice) {
        updateData.totalPrice = totalPrice;
        updateData.originalContractPrice = totalPrice;
        updateData.cashPaidToSeller = totalPrice;
      }
      if (areaVal > 0) {
        updateData.area = areaVal;
      }

      let existingUnit = null;
      try {
        // Search within current project only to avoid cross-project conflicts
        existingUnit = await this.prisma.unit.findFirst({
          where: {
            projectId: project?.id,
            OR: [
              { code: rawCode },
              { code: scopedCode },
            ],
            deletedAt: null,
          }
        });
      } catch (e) {
        existingUnit = null;
      }

      if (existingUnit) {
        if (Object.keys(updateData).length > 0) {
          await this.prisma.unit.update({
            where: { id: existingUnit.id },
            data: updateData,
          });
          updated++;
        }
      } else {
        // Create unit if it doesn't exist and we have enough context
        if (projectId && project && locationId) {
          const uTypeId = await getUnitTypeId(unitTypeName);
          await this.prisma.unit.create({
            data: {
              code: scopedCode,
              title: title,
              titleAr: titleAr,
              titleEn: titleEn,
              description: descriptionAr,
              descriptionAr: descriptionAr,
              descriptionEn: descriptionEn,
              sellerType: 'DEVELOPER',
              projectId: project.id,
              developerId: project.developerId,
              locationId: locationId,
              unitTypeId: uTypeId,
              area: areaVal,
              floor: floorVal ? parseInt(String(floorVal), 10) || null : null,
              bedrooms: isNaN(bedroomsVal) ? 0 : bedroomsVal,
              bathrooms: isNaN(bathroomsVal) ? 0 : bathroomsVal,
              isSeaView: viewVal.toLowerCase().includes('sea'),
              totalPrice: totalPrice || 0,
              originalContractPrice: totalPrice || 0,
              cashPaidToSeller: totalPrice || 0,
              remainingInstallments: 0,
              monthlyEquivalentInstallment: 0,
              contractYear: new Date().getFullYear(),
              deliveryStatus: 'UNDER_CONSTRUCTION',
              deliveryYear: new Date().getFullYear(),
              status: (status || 'APPROVED') as any
            }
          });
          created++;
        } else {
          notFound++;
        }
      }
    }

    return {
      success: true,
      message: `تم الاستيراد بنجاح. تم إضافة ${created} وحدة جديدة، وتحديث ${updated} وحدة، وتجاهل ${notFound} لأن مفيش بيانات كافية.`,
      debug: {
        headerRowIndex,
        totalRows: rows.length,
        skippedNoCode: skipped,
        detectedColumns: { code: colCode || null, status: colStatus || null, price: colPrice || null, area: colArea || null, building: colBuilding || null, unitType: colUnitType || null },
        excelHeaders: headers,
      },
    };
  }

  create(createUnitDto: CreateUnitDto) {
    const data: any = { ...createUnitDto };
    if (!data.projectId) delete data.projectId;
    if (!data.developerId) delete data.developerId;
    if (data.displayOrder !== undefined) {
      if (data.displayOrder === '' || data.displayOrder === null || Number(data.displayOrder) <= 0) {
        data.displayOrder = null;
      } else {
        data.displayOrder = Number(data.displayOrder);
      }
    }
    return this.prisma.unit.create({
      data,
    });
  }

  async findAll(filters: any = {}) {
    const where: any = {
      deletedAt: null,
    };

    if (filters.all !== 'true' && filters.includeHidden !== 'true') {
      where.AND = [
        { OR: [{ developerId: null }, { developer: { isActive: true } }] },
        { OR: [{ projectId: null }, { project: { isActive: true } }] },
      ];
    }

    if (filters.search && typeof filters.search === 'string' && filters.search.trim()) {
      const term = filters.search.trim();
      where.OR = [
        { title: { contains: term, mode: 'insensitive' } },
        { code: { contains: term, mode: 'insensitive' } },
      ];
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.sellerType === 'INDIVIDUAL') {
      where.sellerType = 'INDIVIDUAL';
      // Individual units have developerId = null, so do not filter by developerId/projectId
    } else {
      if (filters.sellerType && filters.sellerType !== 'ALL') {
        where.sellerType = filters.sellerType;
      }
      if (filters.developerId) {
        where.developerId = filters.developerId;
      }
      if (filters.projectId) {
        where.projectId = filters.projectId;
      }
    }

    if (filters.isCashOnly === 'true') {
      where.isCashOnly = true;
    } else if (filters.isCashOnly === 'false') {
      where.isCashOnly = false;
    }

    if (filters.governorate) {
      where.location = {
        ...where.location,
        governorate: filters.governorate,
      };
    }

    const locTarget = filters.location || (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(filters.locationId || '') ? filters.locationId : undefined);
    if (locTarget) {
      const decodedLoc = decodeURIComponent(locTarget).trim();
      where.location = {
        ...where.location,
        OR: [
          { name: { contains: decodedLoc, mode: 'insensitive' } },
          { nameAr: { contains: decodedLoc, mode: 'insensitive' } },
          { nameEn: { contains: decodedLoc, mode: 'insensitive' } },
          { governorate: { contains: decodedLoc, mode: 'insensitive' } },
          { governorateAr: { contains: decodedLoc, mode: 'insensitive' } },
        ],
      };
    } else if (filters.locationId) {
      where.locationId = filters.locationId;
    }

    if (filters.unitTypeId) {
      where.unitTypeId = filters.unitTypeId;
    }

    // Cash Paid / Price Ranges
    if (filters.minCashRequired || filters.maxCashRequired) {
      where.cashPaidToSeller = {};
      if (filters.minCashRequired) {
        where.cashPaidToSeller.gte = parseFloat(filters.minCashRequired);
      }
      if (filters.maxCashRequired) {
        where.cashPaidToSeller.lte = parseFloat(filters.maxCashRequired);
      }
    }

    // Monthly Installment Ranges
    if (filters.minMonthlyInstallment || filters.maxMonthlyInstallment) {
      where.monthlyEquivalentInstallment = {};
      if (filters.minMonthlyInstallment) {
        where.monthlyEquivalentInstallment.gte = parseFloat(filters.minMonthlyInstallment);
      }
      if (filters.maxMonthlyInstallment) {
        where.monthlyEquivalentInstallment.lte = parseFloat(filters.maxMonthlyInstallment);
      }
    }

    // Area Ranges
    if (filters.minArea || filters.maxArea) {
      where.area = {};
      if (filters.minArea) {
        where.area.gte = parseFloat(filters.minArea);
      }
      if (filters.maxArea) {
        where.area.lte = parseFloat(filters.maxArea);
      }
    }

    // Bedrooms
    if (filters.bedrooms) {
      const b = parseInt(filters.bedrooms, 10);
      if (b >= 5) {
        where.bedrooms = { gte: 5 };
      } else if (!isNaN(b)) {
        where.bedrooms = b;
      }
    }

    // Bathrooms
    if (filters.bathrooms) {
      const bt = parseInt(filters.bathrooms, 10);
      if (bt >= 4) {
        where.bathrooms = { gte: 4 };
      } else if (!isNaN(bt)) {
        where.bathrooms = bt;
      }
    }

    // Sea view filter
    if (filters.seaView === 'true' || filters.isSeaView === 'true') {
      where.isSeaView = true;
    }

    // Sorting - Resolve default sort from settings if not specified
    let effectiveSort = filters.sortBy;
    if (!effectiveSort || effectiveSort === 'default') {
      try {
        const defaultSortSetting = await this.prisma.setting.findUnique({
          where: { key: 'default_units_sort' },
        });
        if (defaultSortSetting?.value) {
          effectiveSort = defaultSortSetting.value;
        }
      } catch (err) {
        // Fallback gracefully
      }
    }

    let orderBy: any = [{ displayOrder: { sort: 'asc', nulls: 'last' } }, { createdAt: 'desc' }];
    if (effectiveSort === 'price_asc') {
      orderBy = [{ cashPaidToSeller: 'asc' }, { originalContractPrice: 'asc' }];
    } else if (effectiveSort === 'price_desc') {
      orderBy = [{ cashPaidToSeller: 'desc' }, { originalContractPrice: 'desc' }];
    } else if (effectiveSort === 'total_price_asc') {
      orderBy = [{ originalContractPrice: 'asc' }, { cashPaidToSeller: 'asc' }];
    } else if (effectiveSort === 'total_price_desc') {
      orderBy = [{ originalContractPrice: 'desc' }, { cashPaidToSeller: 'desc' }];
    } else if (effectiveSort === 'highest_roi') {
      orderBy = [
        { displayOrder: { sort: 'asc', nulls: 'last' } },
        { expectedRentalRoi: { sort: 'desc', nulls: 'last' } },
        { cashDiscountPercentage: { sort: 'desc', nulls: 'last' } },
        { createdAt: 'desc' },
      ];
    } else if (effectiveSort === 'newest') {
      orderBy = [{ displayOrder: { sort: 'asc', nulls: 'last' } }, { createdAt: 'desc' }];
    } else if (effectiveSort === 'priority_first') {
      orderBy = [{ displayOrder: { sort: 'asc', nulls: 'last' } }, { createdAt: 'desc' }];
    } else if (effectiveSort === 'sea_view_first') {
      orderBy = [
        { displayOrder: { sort: 'asc', nulls: 'last' } },
        { isSeaView: 'desc' },
        { createdAt: 'desc' },
      ];
    } else if (effectiveSort === 'verified_first') {
      orderBy = [
        { displayOrder: { sort: 'asc', nulls: 'last' } },
        { isVerified: { sort: 'desc', nulls: 'last' } },
        { createdAt: 'desc' },
      ];
    }

    // Support pagination or returning all if all=true
    if (filters.all === 'true') {
      const allUnits = await this.prisma.unit.findMany({
        where,
        orderBy,
        include: {
          developer: true,
          project: true,
          location: true,
          unitType: true,
        },
      });
      return {
        data: allUnits,
        total: allUnits.length,
        page: 1,
        limit: allUnits.length,
        totalPages: 1,
      };
    }

    const page = filters.page ? Math.max(1, parseInt(filters.page, 10)) : 1;
    const rawLimit = filters.limit ? parseInt(filters.limit, 10) : 12;
    const limit = Math.min(100, Math.max(1, isNaN(rawLimit) ? 12 : rawLimit));
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.unit.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          developer: true,
          project: true,
          location: true,
          unitType: true,
        },
      }),
      this.prisma.unit.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async count(): Promise<number> {
    return this.prisma.unit.count({ where: { deletedAt: null } });
  }

  async findOne(identifier: string) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
    const includeConfig = {
      developer: true,
      project: true,
      location: true,
      unitType: true,
    };

    let unit = null;

    if (isUuid) {
      unit = await this.prisma.unit.findFirst({
        where: { id: identifier, deletedAt: null },
        include: includeConfig,
      });
    }

    if (!unit) {
      unit = await this.prisma.unit.findFirst({
        where: {
          code: { equals: identifier, mode: 'insensitive' },
          deletedAt: null,
        },
        include: includeConfig,
      });
    }

    if (!unit) {
      const codeMatch = identifier.match(/(?:^|-)(BH-\d+)$/i);
      if (codeMatch) {
        unit = await this.prisma.unit.findFirst({
          where: {
            code: { equals: codeMatch[1].toUpperCase(), mode: 'insensitive' },
            deletedAt: null,
          },
          include: includeConfig,
        });
      }
    }

    // Fallback: try matching code ending with the identifier (e.g. "123" matches "PROJ-123")
    if (!unit) {
      unit = await this.prisma.unit.findFirst({
        where: {
          code: { endsWith: `-${identifier}`, mode: 'insensitive' },
          deletedAt: null,
        },
        include: includeConfig,
      });
    }

    // Fallback: try partial contains match on code
    if (!unit) {
      unit = await this.prisma.unit.findFirst({
        where: {
          code: { contains: identifier, mode: 'insensitive' },
          deletedAt: null,
        },
        include: includeConfig,
      });
    }

    if (!unit) {
      throw new NotFoundException('العقار غير موجود أو تم حذفه');
    }
    return unit;
  }

  update(id: string, updateUnitDto: UpdateUnitDto) {
    const data: any = { ...updateUnitDto };
    if (data.projectId === '') data.projectId = null;
    if (data.developerId === '') data.developerId = null;
    if (data.displayOrder !== undefined) {
      if (data.displayOrder === '' || data.displayOrder === null || Number(data.displayOrder) <= 0) {
        data.displayOrder = null;
      } else {
        data.displayOrder = Number(data.displayOrder);
      }
    }
    return this.prisma.unit.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.unit.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
