import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DevelopersModule } from './developers/developers.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { UnitsModule } from './units/units.module.js';
import { LocationsModule } from './locations/locations.module.js';
import { UnitTypesModule } from './unit-types/unit-types.module.js';
import { ProjectsModule } from './projects/projects.module.js';
import { IndividualsModule } from './individuals/individuals.module.js';
import { AuthModule } from './auth/auth.module.js';
import { AdminsModule } from './admins/admins.module.js';
import { StatsModule } from './stats/stats.module.js';
import { HeroSlidesModule } from './hero-slides/hero-slides.module.js';
import { UploadModule } from './upload/upload.module.js';
import { SettingsModule } from './settings/settings.module.js';
import { AiSearchModule } from './ai-search/ai-search.module.js';

@Module({
  imports: [
    DevelopersModule,
    PrismaModule,
    UnitsModule,
    LocationsModule,
    UnitTypesModule,
    ProjectsModule,
    IndividualsModule,
    AuthModule,
    AdminsModule,
    StatsModule,
    HeroSlidesModule,
    UploadModule,
    SettingsModule,
    AiSearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
