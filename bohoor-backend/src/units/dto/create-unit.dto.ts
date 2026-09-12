import { DeliveryStatus, SellerType } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUnitDto {
  @IsString({ message: 'عنوان الوحدة يجب أن يكون نصاً' })
  @IsNotEmpty({ message: 'عنوان الوحدة مطلوب' })
  title: string;

  @IsEnum(SellerType, { message: 'نوع البائع غير صالح' })
  sellerType: SellerType;

  @IsOptional()
  @IsString({ message: 'معرف المشروع غير صالح' })
  projectId?: string;

  @IsOptional()
  @IsString({ message: 'معرف المطور غير صالح' })
  developerId?: string;

  @IsString({ message: 'المنطقة مطلوبة' })
  @IsNotEmpty({ message: 'المنطقة مطلوبة' })
  locationId: string;

  @IsString({ message: 'نوع العقار مطلوب' })
  @IsNotEmpty({ message: 'نوع العقار مطلوب' })
  unitTypeId: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'المساحة يجب أن تكون رقماً' })
  @Min(1, { message: 'المساحة يجب أن تكون أكبر من صفر' })
  area: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'عدد الغرف يجب أن يكون رقماً' })
  @Min(0, { message: 'عدد الغرف لا يمكن أن يكون سالباً' })
  bedrooms: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'عدد الحمامات يجب أن يكون رقماً' })
  @Min(0, { message: 'عدد الحمامات لا يمكن أن يكون سالباً' })
  bathrooms: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'سعر العقد الأصلي يجب أن يكون رقماً' })
  originalContractPrice: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'المبلغ المدفوع للبائع كاش يجب أن يكون رقماً' })
  cashPaidToSeller: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'الأقساط المتبقية يجب أن تكون رقماً' })
  remainingInstallments: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'القسط الشهري التقديري يجب أن يكون رقماً' })
  monthlyEquivalentInstallment: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'سنة التعاقد يجب أن تكون رقماً' })
  contractYear: number;

  @IsEnum(DeliveryStatus, { message: 'حالة الاستلام غير صالحة' })
  deliveryStatus: DeliveryStatus;

  @Type(() => Number)
  @IsNumber({}, { message: 'سنة الاستلام يجب أن تكون رقماً' })
  deliveryYear: number;

  @IsOptional()
  @IsBoolean({ message: 'قيمة كاش فقط يجب أن تكون منطقية' })
  isCashOnly?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'نسبة خصم الكاش يجب أن تكون رقماً' })
  cashDiscountPercentage?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'السعر الإجمالي يجب أن يكون رقماً' })
  totalPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'عدد الأقساط يجب أن يكون رقماً' })
  installmentsCount?: number;

  @IsOptional()
  @IsString({ message: 'دورية الأقساط غير صالحة' })
  installmentFrequency?: string;

  @IsOptional()
  @IsString({ message: 'رابط صورة الغلاف غير صالح' })
  coverImage?: string;

  @IsOptional()
  @IsArray({ message: 'الصور يجب أن تكون قائمة روابط' })
  images?: string[];

  @IsOptional()
  @IsArray({ message: 'الفيديوهات يجب أن تكون قائمة روابط' })
  videos?: string[];

  @IsOptional()
  @IsString({ message: 'اسم مقدم الطلب غير صالح' })
  submittedByName?: string;

  @IsOptional()
  @IsString({ message: 'رقم هاتف مقدم الطلب غير صالح' })
  submittedByPhone?: string;

  @IsOptional()
  @IsString({ message: 'حالة التشطيب غير صالحة' })
  finishingStatus?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'رقم الطابق يجب أن يكون رقماً' })
  floor?: number;
}
