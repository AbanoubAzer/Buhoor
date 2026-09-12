import { IsString, IsBoolean, IsOptional, IsInt } from 'class-validator';

export class CreateHeroSlideDto {
  @IsString()
  image: string;

  @IsString()
  title: string;

  @IsString()
  subtitle: string;

  @IsString()
  desc: string;

  @IsString()
  projectName: string;

  @IsString()
  projectLocation: string;

  @IsString()
  projectLocationAr: string;

  @IsString()
  projectType: string;

  @IsString()
  projectArea: string;

  @IsString()
  projectPrice: string;

  @IsOptional()
  @IsString()
  projectLink?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  order?: number;
}
