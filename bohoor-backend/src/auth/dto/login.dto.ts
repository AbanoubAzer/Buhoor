import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'البريد الإلكتروني غير صحيح' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
  password: string;
}
