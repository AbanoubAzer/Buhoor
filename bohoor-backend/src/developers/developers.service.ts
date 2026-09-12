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

  findOne(id: string) {
    return this.prisma.developer.findUnique({
      where: { id },
      include: {
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
      },
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
