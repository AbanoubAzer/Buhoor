import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const [
      developersCount,
      projectsCount,
      unitsCount,
      devUnitsCount,
      indUnitsCount,
      approvedCount,
      soldCount,
      hiddenCount,
      developers,
      projects,
    ] = await Promise.all([
      this.prisma.developer.count(),
      this.prisma.project.count(),
      this.prisma.unit.count({ where: { deletedAt: null } }),
      this.prisma.unit.count({ where: { sellerType: 'DEVELOPER', deletedAt: null } }),
      this.prisma.unit.count({ where: { sellerType: 'INDIVIDUAL', deletedAt: null } }),
      this.prisma.unit.count({ where: { status: 'APPROVED', deletedAt: null } }),
      this.prisma.unit.count({ where: { status: 'SOLD', deletedAt: null } }),
      this.prisma.unit.count({
        where: {
          status: { in: ['HIDDEN', 'PENDING_REVIEW', 'REJECTED'] },
          deletedAt: null,
        },
      }),
      this.prisma.developer.findMany({
        include: {
          _count: {
            select: {
              units: { where: { deletedAt: null } },
              projects: true,
            },
          },
        },
      }),
      this.prisma.project.findMany({
        include: {
          developer: { select: { id: true, name: true, logoUrl: true } },
          units: {
            where: { deletedAt: null },
            select: { id: true, status: true },
          },
          _count: {
            select: { units: { where: { deletedAt: null } } },
          },
        },
      }),
      this.prisma.unit.findMany({
        where: { status: 'PENDING_REVIEW', deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 8,
        include: {
          location: true,
          unitType: true,
          developer: { select: { id: true, name: true } },
          project: { select: { id: true, name: true } },
        },
      }),
    ]);

    // Top developer by units count
    let topDeveloper = null;
    if (developers.length > 0) {
      const sortedDevs = [...developers].sort(
        (a, b) => (b._count?.units ?? 0) - (a._count?.units ?? 0)
      );
      const top = sortedDevs[0];
      topDeveloper = {
        id: top.id,
        name: top.name,
        slug: top.slug,
        logoUrl: top.logoUrl,
        phone: top.phone,
        unitsCount: top._count?.units ?? 0,
        projectsCount: top._count?.projects ?? 0,
      };
    }

    // Top 3 projects by units count
    const topProjects = [...projects]
      .sort((a, b) => (b.units?.length ?? 0) - (a.units?.length ?? 0))
      .slice(0, 3)
      .map((proj) => {
        const total = proj.units?.length ?? 0;
        const approved = proj.units?.filter((u) => u.status === 'APPROVED').length ?? 0;
        return {
          id: proj.id,
          name: proj.name,
          location: proj.location,
          coverImage: proj.coverImage,
          developerName: proj.developer?.name ?? '',
          developerLogo: proj.developer?.logoUrl ?? '',
          totalUnits: total,
          approvedUnits: approved,
          availablePercentage: total > 0 ? Math.round((approved / total) * 100) : 0,
        };
      });

    return {
      developersCount,
      projectsCount,
      unitsCount,
      devUnitsCount,
      indUnitsCount,
      approvedCount,
      soldCount,
      hiddenCount,
      topDeveloper,
      topProjects,
    };
  }
}
