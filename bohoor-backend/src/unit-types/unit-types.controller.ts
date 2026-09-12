import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UnitTypesService } from './unit-types.service.js';
import { CreateUnitTypeDto } from './dto/create-unit-type.dto.js';
import { UpdateUnitTypeDto } from './dto/update-unit-type.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('unit-types')
export class UnitTypesController {
  constructor(private readonly unitTypesService: UnitTypesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createUnitTypeDto: CreateUnitTypeDto) {
    return this.unitTypesService.create(createUnitTypeDto);
  }

  @Get()
  findAll() {
    return this.unitTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.unitTypesService.findOne(id);
  }



  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.unitTypesService.remove(id);
  }
}
