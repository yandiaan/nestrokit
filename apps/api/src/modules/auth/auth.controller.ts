/**
 * Auth Controller
 *
 * Authentication endpoints for login, register, refresh, and logout.
 */

import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import {
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  AuthResponseDto,
  MeResponseDto,
  TokenResponseDto,
} from './auth.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import type { JwtPayload } from './strategies/jwt.strategy';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    // Create user
    const user = await this.userService.create({
      email: dto.email,
      password: dto.password,
      name: dto.name,
    });

    // Login after registration
    const { tokens } = await this.authService.login(dto.email, dto.password);

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        tokens,
      },
    };
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto) {
    const { user, tokens } = await this.authService.login(dto.email, dto.password);

    return {
      success: true,
      data: {
        user,
        tokens,
      },
    };
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: TokenResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(@Body() dto: RefreshTokenDto) {
    const tokens = await this.authService.refreshTokens(dto.refreshToken);

    return {
      success: true,
      data: tokens,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@CurrentUser('sub') userId: string) {
    await this.authService.logout(userId);

    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user info' })
  @ApiResponse({
    status: 200,
    description: 'Current user info',
    type: MeResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async me(@CurrentUser() auth: JwtPayload): Promise<MeResponseDto> {
    const user = await this.userService.findById(auth.sub);

    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
