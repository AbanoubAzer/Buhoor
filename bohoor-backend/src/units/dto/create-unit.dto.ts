import { DeliveryStatus, SellerType, UnitStatus } from '@prisma/client';
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
  @Min(0, { message: 'سعر العقد الأصلي لا يمكن أن يكون سالباً' })
  originalContractPrice: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'المبلغ المدفوع للبائع كاش يجب أن يكون رقماً' })
  @Min(0, { message: 'المبلغ المدفوع للبائع كاش لا يمكن أن يكون سالباً' })
  cashPaidToSeller: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'الأقساط المتبقية يجب أن تكون رقماً' })
  @Min(0, { message: 'الأقساط المتبقية لا يمكن أن تكون سالبة' })
  remainingInstallments: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'القسط الشهري التقديري يجب أن يكون رقماً' })
  @Min(0, { message: 'القسط الشهري التقديري لا يمكن أن يكون سالباً' })
  monthlyEquivalentInstallment: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'سنة التعاقد يجب أن تكون رقماً' })
  @Min(1900, { message: 'سنة التعاقد غير صالحة' })
  contractYear: number;

  @IsEnum(DeliveryStatus, { message: 'حالة الاستلام غير صالحة' })
  deliveryStatus: DeliveryStatus;

  @Type(() => Number)
  @IsNumber({}, { message: 'سنة الاستلام يجب أن تكون رقماً' })
  @Min(1900, { message: 'سنة الاستلام غير صالحة' })
  deliveryYear: number;

  @IsOptional()
  @IsBoolean({ message: 'قيمة كاش فقط يجب أن تكون منطقية' })
  isCashOnly?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'نسبة خصم الكاش يجب أن تكون رقماً' })
  @Min(0, { message: 'نسبة خصم الكاش لا يمكن أن تكون سالبة' })
  cashDiscountPercentage?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'السعر الإجمالي يجب أن يكون رقماً' })
  @Min(0, { message: 'السعر الإجمالي لا يمكن أن يكون سالباً' })
  totalPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'عدد الأقساط يجب أن يكون رقماً' })
  @Min(0, { message: 'عدد الأقساط لا يمكن أن يكون سالباً' })
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
  @IsString({ message: 'وصف العقار يجب أن يكون نصاً' })
  description?: string;

  @IsOptional()
  @IsBoolean({ message: 'قيمة الإطلالة البحرية يجب أن تكون منطقية' })
  isSeaView?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'نسبة العائد الإيجاري يجب أن تكون رقماً' })
  @Min(0, { message: 'نسبة العائد الإيجاري لا يمكن أن تكون سالبة' })
  expectedRentalRoi?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'رقم الطابق يجب أن يكون رقماً' })
  @Min(0, { message: 'رقم الطابق لا يمكن أن يكون سالباً' })
  floor?: number;

  @IsOptional()
  @IsEnum(UnitStatus, { message: 'حالة العقار غير صالحة' })
  status?: UnitStatus;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'أولوية الترتيب يجب أن تكون رقماً' })
  @Min(0, { message: 'أولوية الترتيب لا يمكن أن تكون سالبة' })
  displayOrder?: number;

  @IsOptional()
  @IsString()
  code?: string;
}
