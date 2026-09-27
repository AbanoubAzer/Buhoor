import { Injectable } from '@nestjs/common';
import { CreateDeveloperDto } from './dto/create-developer.dto.js';
import { UpdateDeveloperDto } from './dto/update-developer.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class DevelopersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createDeveloperDto: CreateDeveloperDto) {
    return this.prisma.developer.create({
      data: {
        name: createDeveloperDto.name,
        slug: createDeveloperDto.slug,
        logoUrl: createDeveloperDto.logoUrl,
        bio: createDeveloperDto.bio,
        phone: createDeveloperDto.phone,
      }
    });
  }

  findAll() {
    return this.prisma.developer.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        projects: {
          include: {
            _count: { select: { units: { where: { deletedAt: null } } } },
          },
        },
        units: {
          where: { deletedAt: null },
          select: { id: true },
        },
        _count: {
          select: {
            projects: true,
            units: { where: { deletedAt: null } },
          },
        },
      },
    });
  }

  async count(): Promise<number> {
    return this.prisma.developer.count();
  }

  async findOne(identifier: string) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
    
    const includeConfig = {
      projects: {
        include: {
          units: {
            where: { deletedAt: null },
            include: { location: true, unitType: true },
          },
          _count: {
            select: { units: { where: { deletedAt: null } } },
          },
        },
      },
      units: {
        where: { deletedAt: null },
        include: { location: true, unitType: true, project: true },
      },
    };

    if (isUuid) {
      const byId = await this.prisma.developer.findUnique({
        where: { id: identifier },
        include: includeConfig,
      });
      if (byId) return byId;
    }

    // Try by slug
    return this.prisma.developer.findFirst({
      where: {
        OR: [
          { slug: { equals: identifier, mode: 'insensitive' } },
          { name: { equals: identifier, mode: 'insensitive' } },
        ],
      },
      include: includeConfig,
    });
  }

  update(id: string, updateDeveloperDto: UpdateDeveloperDto) {
    return this.prisma.developer.update({
      where: { id },
      data: updateDeveloperDto,
    });
  }

  remove(id: string) {
    return this.prisma.developer.delete({ where: { id } });
  }
}
