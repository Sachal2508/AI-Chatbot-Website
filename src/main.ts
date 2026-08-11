import 'reflect-metadata';
import * as Sentry from '@sentry/node';

// Sentry MUST be initialized before the Nest app is created so it can
// capture errors that happen during bootstrap as well as at runtime.
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: 1.0,
});

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';
import { SentryExceptionFilter } from './common/filters/sentry-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static assets from 'public' folder (Frontend UI at http://localhost:3000)
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Enable CORS so any frontend (or Swagger UI itself) can call the API
  app.enableCors();

  // Global validation: every DTO decorated with class-validator rules
  // is automatically checked, and unknown/invalid fields are rejected.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Any unhandled exception anywhere in the app is reported to Sentry
  // AND returned to the client as a clean JSON error response.
  app.useGlobalFilters(new SentryExceptionFilter());

  // Swagger / OpenAPI docs, served at /docs
  const config = new DocumentBuilder()
    .setTitle('AI Chatbot API')
    .setDescription(
      'Production-ready AI Chatbot API - NestJS + Groq + Resend + Swagger + Sentry. ' +
        'Built for the AI Automation Internship 2026 Program (DaFi Labs x EmpRadar.ai), Session 3.',
    )
    .setVersion('1.0')
    .addTag('chat', 'AI chatbot conversation endpoints')
    .addTag('email', 'Transactional email endpoints (Resend)')
    .addTag('health', 'Health check')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-standalone-preset.min.js',
    ],
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📚 Swagger docs at http://localhost:${port}/docs`);
}

bootstrap();
