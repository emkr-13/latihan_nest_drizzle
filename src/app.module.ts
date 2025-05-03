import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('AUTH_TOKEN_EXP'),
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL!, {
      connectionFactory: (connection) => {
        console.log('✅ Connected to MongoDB via MongooseModule');
        return connection;
      },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const app = (this as any).appRef; // Akses aplikasi NestJS
    if (!app) return;

    const config = new DocumentBuilder()
      .setTitle('E-commerce API')
      .setDescription('API documentation for E-commerce Mini Project')
      .setVersion('1.0')
      .addTag('Auth', 'Authentication endpoints')
      .addTag('User', 'User profile and management')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    console.log(`🚀 Swagger available at http://localhost:${this.configService.get('APP_PORT')}/api`);
  }
}