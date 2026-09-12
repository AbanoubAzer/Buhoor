import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service.js';
import { AdminsController } from './admins.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [AdminsController],
  providers: [AdminsService],
})
export class AdminsModule {}
