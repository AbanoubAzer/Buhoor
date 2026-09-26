import { Controller, Post, Get, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AiSearchService } from './ai-search.service.js';
import { AiSearchDto } from './dto/ai-search.dto.js';

@Controller('ai-search')
export class AiSearchController {
  constructor(private readonly aiSearchService: AiSearchService) {}

  @Post()
  async search(@Body() dto: AiSearchDto) {
    return this.aiSearchService.searchAndMatch(dto);
  }

  @Get('admin/searches')
  async getAllSearches() {
    return this.aiSearchService.getAllSearches();
  }

  @Get('admin/export-excel')
  async exportExcel(@Res() res: Response) {
    const buffer = await this.aiSearchService.exportToExcel();
    
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="bohoor-ai-customer-matches.xlsx"',
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.end(buffer);
  }
}
