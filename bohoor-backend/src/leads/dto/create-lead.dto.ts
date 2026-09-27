import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLeadDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  questions?: string;

  @IsString()
  @IsOptional()
  readiness?: string;

  @IsString()
  @IsOptional()
  sellerType?: string;

  @IsString()
  @IsOptional()
  commission?: string;

  @IsString()
  @IsOptional()
  language?: string;

  @IsString()
  @IsOptional()
  unitId?: string;

  @IsString()
  @IsOptional()
  source?: string;
}
