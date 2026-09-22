import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto.js';
import { UpdateUnitDto } from './dto/update-unit.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UnitsService {
  constructor(private readonly prisma: PrismaService) {}

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

    if (filters.locationId) {
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

  async findOne(id: string) {
    const unit = await this.prisma.unit.findFirst({
      where: { id, deletedAt: null },
      include: {
        developer: true,
        project: true,
        location: true,
        unitType: true,
      },
    });
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
