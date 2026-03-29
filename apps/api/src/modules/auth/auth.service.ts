/**
 * Auth Service
 *
 * Handles authentication logic including:
 * - Login (validate credentials, issue tokens)
 * - Token refresh
 * - Logout (invalidate refresh tokens)
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes, createHash } from 'crypto';

import {
  UnauthorizedError,
  NotFoundError,
} from '@repo/core/errors';
import { userRepository } from '@repo/database';
import { unwrapOrThrow } from '@repo/utils/fp';
import * as O from 'fp-ts/Option';

import type { JwtPayload } from './strategies/jwt.strategy';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
}

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;
  private readonly accessTokenExpirySeconds: number;

  constructor(
    private readonly jwtService: JwtService,
    configService: ConfigService,
  ) {
    this.jwtSecret = configService.get<string>('JWT_SECRET', 'dev-secret-change-me');
    this.accessTokenExpiry = configService.get<string>('JWT_ACCESS_EXPIRY', '15m');
    this.refreshTokenExpiry = configService.get<string>('JWT_REFRESH_EXPIRY', '7d');
    this.accessTokenExpirySeconds = this.parseExpiry(this.accessTokenExpiry);
  }

  /**
   * Authenticate user with email and password
   */
  async login(email: string, password: string): Promise<{ user: AuthenticatedUser; tokens: TokenPair }> {
    // Find user by email
    const maybeUser = await unwrapOrThrow(userRepository.findByEmail(email));

    if (O.isNone(maybeUser)) {
      throw UnauthorizedError.invalidCredentials();
    }

    const user = maybeUser.value;

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      throw UnauthorizedError.invalidCredentials();
    }

    // Generate tokens
    const tokens = await this.generateTokenPair(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      tokens,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.jwtSecret,
      });

      if (payload.type !== 'refresh') {
        throw UnauthorizedError.tokenInvalid();
      }

      // Verify user still exists
      const maybeUser = await unwrapOrThrow(userRepository.findById(payload.sub));

      if (O.isNone(maybeUser)) {
        throw new NotFoundError('User', payload.sub);
      }

      const user = maybeUser.value;

      // Generate new token pair
      return this.generateTokenPair(user.id, user.email, user.role);
    } catch (error) {
      if (error instanceof UnauthorizedError || error instanceof NotFoundError) {
        throw error;
      }

      // JWT verification failed
      throw UnauthorizedError.tokenInvalid();
    }
  }

  /**
   * Logout user (for stateless JWT, this is a no-op on server)
   * In production, you'd want to blacklist the token or use refresh token rotation
   */
  async logout(_userId: string): Promise<void> {
    // With stateless JWT, logout is handled client-side by deleting tokens
    // For enhanced security, implement token blacklisting with Redis
    // or refresh token rotation with database storage
  }

  /**
   * Generate access and refresh token pair
   */
  private async generateTokenPair(
    userId: string,
    email: string,
    role: 'USER' | 'ADMIN',
  ): Promise<TokenPair> {
    const basePayload = {
      sub: userId,
      email,
      role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { ...basePayload, type: 'access' as const },
        {
          secret: this.jwtSecret,
          expiresIn: this.accessTokenExpirySeconds,
        },
      ),
      this.jwtService.signAsync(
        { ...basePayload, type: 'refresh' as const },
        {
          secret: this.jwtSecret,
          expiresIn: this.parseExpiry(this.refreshTokenExpiry),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.accessTokenExpirySeconds,
    };
  }

  /**
   * Parse expiry string to seconds
   */
  private parseExpiry(expiry: string): number {
    const match = expiry.match(/^(\d+)([smhd])$/);

    if (!match || !match[1]) {
      return 900; // Default 15 minutes
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 60 * 60 * 24;
      default:
        return 900;
    }
  }

  /**
   * Generate secure random token (for refresh tokens stored in DB)
   */
  generateSecureToken(): string {
    return randomBytes(32).toString('hex');
  }

  /**
   * Hash token for storage (for refresh tokens stored in DB)
   */
  hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
