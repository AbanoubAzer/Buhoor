import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: "yczynhyi",
  api_key: "467227274238734",
  api_secret: "EPRfcM0Y_r3R6cSj-2ekez05Dcs",
});

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('لم يتم رفع أي ملف');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'bohoor_admin' },
        (error, result) => {
          if (error) return reject(new BadRequestException('فشل رفع الصورة إلى سحابة التخزين'));
          resolve({ url: result?.secure_url });
        }
      );
      
      Readable.from(file.buffer).pipe(uploadStream);
    });
  }
}
