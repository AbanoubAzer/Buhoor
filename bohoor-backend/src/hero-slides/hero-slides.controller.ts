import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HeroSlidesService } from './hero-slides.service.js';
import { CreateHeroSlideDto } from './dto/create-hero-slide.dto.js';
import { UpdateHeroSlideDto } from './dto/update-hero-slide.dto.js';

@Controller('hero-slides')
export class HeroSlidesController {
  constructor(private readonly heroSlidesService: HeroSlidesService) {}

  @Post()
  create(@Body() createHeroSlideDto: CreateHeroSlideDto) {
    return this.heroSlidesService.create(createHeroSlideDto);
  }

  @Get()
  findAll() {
    return this.heroSlidesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.heroSlidesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHeroSlideDto: UpdateHeroSlideDto) {
    return this.heroSlidesService.update(id, updateHeroSlideDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.heroSlidesService.remove(id);
  }
}
