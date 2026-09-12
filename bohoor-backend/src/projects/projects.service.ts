import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(developerId?: string) {
    return this.prisma.project.findMany({
      where: developerId ? { developerId } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        developer: { select: { id: true, name: true, logoUrl: true } },
        units: {
          where: { deletedAt: null },
          select: { id: true, title: true, status: true, cashPaidToSeller: true, sellerType: true, coverImage: true }
        },
        _count: { select: { units: { where: { deletedAt: null } } } },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      include: {
        developer: true,
        units: {
          where: { deletedAt: null },
          include: { location: true, unitType: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  create(data: { name: string; developerId: string; location: string; description?: string; coverImage: string }) {
    return this.prisma.project.create({ data });
  }

  update(id: string, data: Partial<{ name: string; location: string; description: string; coverImage: string }>) {
    return this.prisma.project.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.project.delete({ where: { id } });
  }

  async count(): Promise<number> {
    return this.prisma.project.count();
  }
}
