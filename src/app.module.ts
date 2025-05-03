import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Akses langsung di dalam modul
const MONGODB_URL = process.env.MONGODB_URL;

@Module({
  imports: [
    MongooseModule.forRoot(MONGODB_URL!, {
      connectionFactory: (connection) => {
        console.log('✅ Connected to MongoDB via MongooseModule');
        return connection;
      },
    }),
  ],
})
export class AppModule {}