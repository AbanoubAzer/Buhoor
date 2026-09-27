import { Controller, Post, Body, Get, Query, Res } from '@nestjs/common';
import { LeadsService } from './leads.service.js';
import { CreateLeadDto } from './dto/create-lead.dto.js';
import type { Response } from 'express';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  async createLead(@Body() dto: CreateLeadDto) {
    return this.leadsService.createLead(dto);
  }

  @Get()
  async getAllLeads(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.leadsService.getAllLeads(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 50,
    );
  }

  @Get('export-excel')
  async exportExcel(@Res() res: Response) {
    const buffer = await this.leadsService.exportExcel();
    const filename = `bohoor-leads-${new Date().toISOString().slice(0, 10)}.xlsx`;

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${filename}"`,
    );
    res.send(buffer);
  }
}
