import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export const DEFAULT_SORT_SETTING_KEY = 'default_units_sort';
export const DEFAULT_SORT_VALUE = 'priority_first';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async get(key: string, defaultValue = ''): Promise<string> {
    const setting = await this.prisma.setting.findUnique({
      where: { key },
    });
    return setting ? setting.value : defaultValue;
  }

  async set(key: string, value: string) {
    return this.prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  async getDefaultSort(): Promise<{ defaultSort: string }> {
    const defaultSort = await this.get(DEFAULT_SORT_SETTING_KEY, DEFAULT_SORT_VALUE);
    return { defaultSort };
  }

  async updateDefaultSort(defaultSort: string): Promise<{ defaultSort: string }> {
    await this.set(DEFAULT_SORT_SETTING_KEY, defaultSort);
    return { defaultSort };
  }
}
