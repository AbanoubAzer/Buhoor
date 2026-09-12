import { Module } from '@nestjs/common';
import { IndividualsService } from './individuals.service.js';
import { IndividualsController } from './individuals.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [IndividualsController],
  providers: [IndividualsService],
})
export class IndividualsModule {}
