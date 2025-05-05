import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../src/auth/auth.service';
import { AuthRepository } from '../src/auth/repository/auth.repository';
import { UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../src/auth/dto/login.dto';

// Define a type that matches your user schema
type MockUser = {
  id: string;
  email: string;
  password: string;
  fullname: string | null;
  role: 'admin' | 'user';
  refreshToken: string | null;
  refreshTokenExp: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
} | null;

describe('AuthService', () => {
  let authService: AuthService;
  let authRepo: AuthRepository;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthRepository,
          useValue: {
            findUserByEmail: jest.fn(),
            updateUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authRepo = module.get<AuthRepository>(AuthRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('should return tokens when login is successful', async () => {
      const mockUser: MockUser = {
        id: 'd1368e5e-8b6a-4a9b-9a4e-7d3e0b1a2c3f',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        fullname: 'Test User',
        role: 'user', // Explicitly set as 'user'
        refreshToken: null,
        refreshTokenExp: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockTokens = {
        token: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
      };

      jest.spyOn(authRepo, 'findUserByEmail').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce(mockTokens.token);
      jest
        .spyOn(jwtService, 'sign')
        .mockReturnValueOnce(mockTokens.refreshToken);
      jest.spyOn(authRepo, 'updateUser').mockResolvedValue(mockUser);

      const result = await authService.login(loginDto);

      expect(result).toEqual({
        success: true,
        message: 'Login successful',
        data: mockTokens,
      });
      expect(authRepo.findUserByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
    });

    it('should throw UnauthorizedException when user not found', async () => {
      const loginDto: LoginDto = {
        email: 'notfound@example.com',
        password: 'password123',
      };

      jest.spyOn(authRepo, 'findUserByEmail').mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const mockUser: MockUser = {
        id: 'd1368e5e-8b6a-4a9b-9a4e-7d3e0b1a2c3f',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        fullname: 'Test User',
        role: 'user',
        refreshToken: null,
        refreshTokenExp: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      jest.spyOn(authRepo, 'findUserByEmail').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
