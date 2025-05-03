import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './repository/auth.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        // Validate that required environment variables are set
        const jwtSecret = configService.get('JWT_SECRET');
        if (!jwtSecret) {
          throw new Error('JWT_SECRET is not configured');
        }

        return {
          secret: jwtSecret,
          signOptions: {
            expiresIn: configService.get('AUTH_TOKEN_EXP', '1h'), // Default 1 hour if not set
          },
        };
      },
      inject: [ConfigService],
    }),
    // Ensure ConfigModule is imported globally if not already
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository],
  exports: [JwtModule], // Export JwtModule to make it available to other modules
})
export class AuthModule {}
