import { Module } from '@nestjs/common';
import { HeroSlidesService } from './hero-slides.service.js';
import { HeroSlidesController } from './hero-slides.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [HeroSlidesController],
  providers: [HeroSlidesService],
})
export class HeroSlidesModule {}
