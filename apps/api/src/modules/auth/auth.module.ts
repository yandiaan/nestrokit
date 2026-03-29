/**
 * Auth Module
 *
 * Handles authentication (JWT) - Full implementation in Section 7
 */

import { Module } from '@nestjs/common';
import { JwtModule, type JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => ({
        secret: config.get<string>('JWT_SECRET', 'dev-secret-change-me'),
        signOptions: {
          expiresIn: config.get<string>('JWT_ACCESS_EXPIRY', '15m') as `${number}m`,
        },
      }),
    }),
  ],
  providers: [],
  controllers: [],
  exports: [JwtModule],
})
export class AuthModule {}
