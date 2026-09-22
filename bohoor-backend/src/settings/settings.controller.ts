import { Controller, Get, Body, Patch, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('default-sort')
  getDefaultSort() {
    return this.settingsService.getDefaultSort();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('default-sort')
  updateDefaultSort(@Body() body: { defaultSort: string }) {
    return this.settingsService.updateDefaultSort(body.defaultSort);
  }
}
