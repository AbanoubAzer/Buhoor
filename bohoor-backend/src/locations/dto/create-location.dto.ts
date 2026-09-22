import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLocationDto {
  @IsString({ message: 'اسم المنطقة يجب أن يكون نصاً' })
  @IsNotEmpty({ message: 'اسم المنطقة مطلوب' })
  name: string;

  @IsOptional()
  @IsString({ message: 'اسم المحافظة يجب أن يكون نصاً' })
  governorate?: string;

  @IsOptional()
  @IsString({ message: 'رابط الصورة يجب أن يكون نصاً' })
  imageUrl?: string;
}