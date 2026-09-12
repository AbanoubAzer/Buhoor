import { Module } from '@nestjs/common';
import { UnitTypesService } from './unit-types.service.js';
import { UnitTypesController } from './unit-types.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [UnitTypesController],
  providers: [UnitTypesService],
})
export class UnitTypesModule {}
