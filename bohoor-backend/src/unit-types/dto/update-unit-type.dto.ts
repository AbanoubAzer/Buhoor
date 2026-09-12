import { PartialType } from '@nestjs/mapped-types';
import { CreateUnitTypeDto } from './create-unit-type.dto.js';

export class UpdateUnitTypeDto extends PartialType(CreateUnitTypeDto) {}
