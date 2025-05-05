import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoriesRepository } from './repository/categories.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesGuard } from '../utils/guards/roles.guard';


@Module({
  imports: [
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
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository,RolesGuard],
})
export class CategoriesModule {}
