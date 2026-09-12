import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  create(createLocationDto: { name: string }) {
    return this.prisma.location.create({ data: createLocationDto });
  }

  findAll() {
    return this.prisma.location.findMany({ orderBy: { name: 'asc' } });
  }

  findOne(id: string) {
    return this.prisma.location.findUnique({ where: { id } });
  }

  remove(id: string) {
    return this.prisma.location.delete({ where: { id } });
  }
}
