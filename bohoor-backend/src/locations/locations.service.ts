import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateLocationDto } from './dto/create-location.dto.js';
import { UpdateLocationDto } from './dto/update-location.dto.js';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  create(createLocationDto: CreateLocationDto) {
    return this.prisma.location.create({ data: createLocationDto });
  }

  findAll() {
    return this.prisma.location.findMany({
      orderBy: [{ governorate: 'asc' }, { name: 'asc' }],
    });
  }

  findOne(id: string) {
    return this.prisma.location.findUnique({ where: { id } });
  }

  update(id: string, updateLocationDto: UpdateLocationDto) {
    return this.prisma.location.update({
      where: { id },
      data: updateLocationDto,
    });
  }

  remove(id: string) {
    return this.prisma.location.delete({ where: { id } });
  }
}
