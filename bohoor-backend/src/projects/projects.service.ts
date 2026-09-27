import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(developerId?: string) {
    let developerFilter: any = undefined;

    if (developerId) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(developerId);
      if (isUuid) {
        developerFilter = { developerId };
      } else {
        // It's a slug or name — find the developer first
        const dev = await this.prisma.developer.findFirst({
          where: {
            OR: [
              { slug: { equals: developerId, mode: 'insensitive' } },
              { name: { equals: developerId, mode: 'insensitive' } },
            ],
          },
          select: { id: true },
        });
        developerFilter = dev ? { developerId: dev.id } : { developerId: '' };
      }
    }

    return this.prisma.project.findMany({
      where: developerFilter,
      orderBy: { createdAt: 'desc' },
      include: {
        developer: { select: { id: true, name: true, logoUrl: true, slug: true } },
        units: {
          where: { deletedAt: null },
          select: { id: true, title: true, status: true, cashPaidToSeller: true, sellerType: true, coverImage: true }
        },
        _count: { select: { units: { where: { deletedAt: null } } } },
      },
    });
  }

  async findOne(identifier: string) {
    const decoded = decodeURIComponent(identifier).trim();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(decoded);
    
    const includeConfig = {
      developer: true,
      units: {
        where: { deletedAt: null },
        include: { location: true, unitType: true },
        orderBy: { createdAt: 'desc' as const },
      },
    };

    if (isUuid) {
      const byId = await this.prisma.project.findUnique({
        where: { id: decoded },
        include: includeConfig,
      });
      if (byId) return byId;
    }

    // Try finding by slug or name
    return this.prisma.project.findFirst({
      where: {
        OR: [
          { slug: { equals: decoded, mode: 'insensitive' } },
          { name: { equals: decoded, mode: 'insensitive' } },
        ],
      },
      include: includeConfig,
    });
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s\u0621-\u064A-]/g, '')
      .trim()
      .replace(/[\s_-]+/g, '-');
  }

  create(data: { name: string; developerId: string; location: string; description?: string; coverImage: string; slug?: string }) {
    const slug = data.slug || this.generateSlug(data.name);
    return this.prisma.project.create({ data: { ...data, slug } });
  }

  update(id: string, data: Partial<{ name: string; location: string; description: string; coverImage: string; slug?: string }>) {
    if (data.name && !data.slug) {
      data.slug = this.generateSlug(data.name);
    }
    return this.prisma.project.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.project.delete({ where: { id } });
  }

  async count(): Promise<number> {
    return this.prisma.project.count();
  }
}
