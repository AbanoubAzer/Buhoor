import { Module } from '@nestjs/common';
import { AiSearchController } from './ai-search.controller.js';
import { AiSearchService } from './ai-search.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [AiSearchController],
  providers: [AiSearchService],
  exports: [AiSearchService],
})
export class AiSearchModule {}
