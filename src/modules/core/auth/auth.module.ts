import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import {
  GOOGLE_O_AUTH2_CLIENT_TOKEN,
  JWKS_CLIENT_TOKEN,
} from '@src/modules/core/auth/constants/auth.constant';
import { AuthHelper } from '@src/modules/core/auth/helpers/auth.helper';
import { JwtStrategy } from '@src/modules/core/auth/jwt/jwt.strategy';
import { AuthService } from '@src/modules/core/auth/services/auth.service';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { OAuth2Client } from 'google-auth-library';
import jwksClient from 'jwks-rsa';
import { HttpConfigModule } from '../http/http-config.module';
import { OptionalJwtStrategy } from './jwt/optional-jwt.strategy';

@Module({
  imports: [
    HttpConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('SECRET_KEY'),
          signOptions: {
            expiresIn: '10y',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    OptionalJwtStrategy,
    PrismaService,
    AuthHelper,
    {
      provide: GOOGLE_O_AUTH2_CLIENT_TOKEN,
      useClass: OAuth2Client,
    },
    {
      provide: JWKS_CLIENT_TOKEN,
      useValue: jwksClient({
        jwksUri: 'https://appleid.apple.com/auth/keys',
      }),
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
