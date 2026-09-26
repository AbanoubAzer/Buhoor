import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class AiSearchDto {
  @IsString()
  @IsNotEmpty()
  query: string;

  @IsString()
  @IsOptional()
  customerName?: string;

  @IsString()
  @IsOptional()
  customerPhone?: string;

  @IsString()
  @IsOptional()
  userId?: string;
}
