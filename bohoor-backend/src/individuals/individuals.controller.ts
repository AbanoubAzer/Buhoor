import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { IndividualsService } from './individuals.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('individuals')
@UseGuards(JwtAuthGuard)
export class IndividualsController {
  constructor(private readonly individualsService: IndividualsService) {}

  @Get()
  findAll() {
    return this.individualsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.individualsService.findOne(id);
  }
}
