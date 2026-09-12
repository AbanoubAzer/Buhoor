import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UnitTypesService {
  constructor(private prisma: PrismaService) {}

  create(createUnitTypeDto: { name: string }) {
    return this.prisma.unitTypeModel.create({ data: createUnitTypeDto });
  }

  findAll() {
    return this.prisma.unitTypeModel.findMany({ orderBy: { name: 'asc' } });
  }

  findOne(id: string) {
    return this.prisma.unitTypeModel.findUnique({ where: { id } });
  }

  remove(id: string) {
    return this.prisma.unitTypeModel.delete({ where: { id } });
  }
}
