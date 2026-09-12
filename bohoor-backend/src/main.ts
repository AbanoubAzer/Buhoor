import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { AppModule } from './app.module.js';
import { INestApplication } from '@nestjs/common';

export async function setupApp(app: INestApplication) {
  // 1. Security Headers via Helmet
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  // 2. HTTP Response Compression (Gzip/Deflate)
  app.use(compression());

  // 3. Global Rate Limiter (Max 150 requests per minute per IP)
  const globalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 150,
    standardHeaders: true,
    legacyHeaders: false,
    message: { statusCode: 429, message: 'تجاوزت الحد المسموح من الطلبات، يرجى المحاولة بعد دقيقة' },
  });
  app.use(globalLimiter);

  // 4. Stricter Rate Limiter for Login (Max 10 login attempts per minute per IP)
  const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { statusCode: 429, message: 'محاولات دخول كثيرة جداً، يرجى الانتظار دقيقة قبل المحاولة مرة أخرى' },
  });
  app.use('/auth/login', loginLimiter);

  // 5. Secured CORS
  const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'https://buhoor-web.vercel.app',
    ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : []),
  ];

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // 6. Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  
  return app;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await setupApp(app);

  const port = process.env.PORT ?? 3333;
  await app.listen(port);
  console.log(`🚀 Backend running on port ${port}`);
}

// Only run bootstrap if this file is executed directly (e.g. not imported by Vercel)
if (process.env.VERCEL !== '1') {
  bootstrap();
}
