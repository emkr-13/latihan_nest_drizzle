import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { connectMongo } from './db/mongoConfig';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validasi MONGODB_URL
  const MONGODB_URL = process.env.MONGODB_URL;
  if (!MONGODB_URL) {
    console.error('❌ MONGODB_URL is not defined in .env file');
    process.exit(1);
  }

  // Cek koneksi MongoDB
  try {
    await connectMongo();
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }

  // Konfigurasi Swagger
  const config = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription('API documentation for E-commerce Mini Project')
    .setVersion('1.0')
    .addTag('Auth', 'Authentication endpoints')
    .addTag('User', 'User profile and management')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // Ganti path menjadi '/docs'

  const port = process.env.APP_PORT || 3080;

  await app.listen(port, () => {
    console.log(`🚀 Application running on http://localhost:${port}`);
    console.log(`📖 Swagger available at http://localhost:${port}/docs`);
  });
}

bootstrap();