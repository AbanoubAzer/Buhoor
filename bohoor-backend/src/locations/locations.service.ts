import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateLocationDto } from './dto/create-location.dto.js';
import { UpdateLocationDto } from './dto/update-location.dto.js';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  async create(createLocationDto: CreateLocationDto) {
    try {
      const data: any = { name: createLocationDto.name.trim() };
      if (createLocationDto.governorate?.trim()) {
        data.governorate = createLocationDto.governorate.trim();
      }
      if (createLocationDto.imageUrl?.trim()) {
        data.imageUrl = createLocationDto.imageUrl.trim();
      }
      return await this.prisma.location.create({ data });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new BadRequestException('اسم المنطقة موجود بالفعل، يرجى اختيار اسم آخر');
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.location.findMany({
      orderBy: [{ governorate: 'asc' }, { name: 'asc' }],
    });
  }

  findOne(id: string) {
    return this.prisma.location.findUnique({ where: { id } });
  }

  async update(id: string, updateLocationDto: UpdateLocationDto) {
    try {
      const data: any = {};
      if (updateLocationDto.name !== undefined) {
        data.name = updateLocationDto.name.trim();
      }
      if (updateLocationDto.governorate !== undefined) {
        data.governorate = updateLocationDto.governorate?.trim() || null;
      }
      if (updateLocationDto.imageUrl !== undefined) {
        data.imageUrl = updateLocationDto.imageUrl?.trim() || null;
      }

      return await this.prisma.location.update({
        where: { id },
        data,
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new BadRequestException('اسم المنطقة موجود بالفعل، يرجى اختيار اسم آخر');
      }
      throw error;
    }
  }

  remove(id: string) {
    return this.prisma.location.delete({ where: { id } });
  }
}
