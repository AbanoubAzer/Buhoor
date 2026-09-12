import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class IndividualsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.unit.findMany({
      where: {
        sellerType: 'INDIVIDUAL',
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        location: true,
        unitType: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.unit.findFirst({
      where: {
        id,
        sellerType: 'INDIVIDUAL',
        deletedAt: null,
      },
      include: {
        location: true,
        unitType: true,
      },
    });
  }
}
