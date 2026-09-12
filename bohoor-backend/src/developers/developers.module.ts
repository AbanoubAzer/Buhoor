import { Module } from '@nestjs/common';
import { DevelopersService } from './developers.service.js';
import { DevelopersController } from './developers.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [DevelopersController],
  providers: [DevelopersService],
})
export class DevelopersModule {}
