import { config } from 'dotenv';
config()
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { connectMongo } from './db/mongoConfig';

async function bootstrap() {
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

  // Jalankan aplikasi
  const app = await NestFactory.create(AppModule);
  const port = process.env.APP_PORT || 3080;

  await app.listen(port, () => {
    console.log(`🚀 Application running on http://localhost:${port}`);
  });
}

bootstrap();