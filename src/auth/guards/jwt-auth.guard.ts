// src/auth/guards/jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      // Jika tidak ada token, cek apakah endpoint boleh dilewati
      const skipIfNoJWT = this.reflector.getAllAndOverride<boolean>('skipIfNoJWT', [
        context.getHandler(),
        context.getClass(),
      ]);

      if (skipIfNoJWT) {
        return true; // Melewati jika diperbolehkan
      }

      return false;
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      // Attach user to request
      request['user'] = payload;
      return true;
    } catch {
      return false;
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = (request.headers as any)['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}