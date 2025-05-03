import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

export const SKIP_JWT_AUTH_KEY = 'skipIfNoJWT';

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
      const skipIfNoJWT = this.reflector.getAllAndOverride<boolean>(SKIP_JWT_AUTH_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (skipIfNoJWT) {
        return true;
      }
      throw new UnauthorizedException('No token provided');
    }

    try {
      // console.log('Received token:', token);
      // console.log('JWT Secret:', process.env.JWT_SECRET);
      
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      
      // console.log('Decoded payload:', payload);
      request['user'] = payload;
      return true;
    } catch (error) {
      console.error('Token verification error:', error.message);
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}