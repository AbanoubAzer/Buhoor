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

    if (filters.sellerType) {
      where.sellerType = filters.sellerType;
    }

    if (filters.locationId) {
      where.locationId = filters.locationId;
    }

    if (filters.developerId) {
      where.developerId = filters.developerId;
    }

    if (filters.projectId) {
      where.projectId = filters.projectId;
    }

    if (filters.unitTypeId) {
      where.unitTypeId = filters.unitTypeId;
    }

    if (filters.maxCashRequired) {
      where.cashPaidToSeller = { lte: parseFloat(filters.maxCashRequired) };
    }

    if (filters.maxMonthlyInstallment) {
      where.monthlyEquivalentInstallment = { lte: parseFloat(filters.maxMonthlyInstallment) };
    }

    // Support pagination or returning all if all=true
    if (filters.all === 'true') {
      const allUnits = await this.prisma.unit.findMany({
        where,
        orderBy: { createdAt: 'desc' },
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
    // Cap limit to a maximum of 100 items per page to prevent denial-of-service / memory exhaustion
    const rawLimit = filters.limit ? parseInt(filters.limit, 10) : 12;
    const limit = Math.min(100, Math.max(1, isNaN(rawLimit) ? 12 : rawLimit));
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.unit.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
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
