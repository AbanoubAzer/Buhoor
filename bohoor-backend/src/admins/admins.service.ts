import { Injectable, ConflictException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminsService {
  constructor(private prisma: PrismaService) {}

  async create(createAdminDto: CreateAdminDto) {
    const existingAdmin = await this.prisma.admin.findUnique({
      where: { email: createAdminDto.email },
    });
    
    if (existingAdmin) {
      throw new ConflictException('البريد الإلكتروني موجود بالفعل');
    }

    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

    const admin = await this.prisma.admin.create({
      data: {
        name: createAdminDto.name,
        email: createAdminDto.email,
        password: hashedPassword,
      },
    });

    const { password, ...result } = admin;
    return result;
  }

  async findAll() {
    return this.prisma.admin.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.admin.delete({
      where: { id },
    });
  }
}
