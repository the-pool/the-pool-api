import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CommonHelper } from '@src/helpers/common.helper';
import {
  GOOGLE_O_AUTH2_CLIENT_TOKEN,
  JWKS_CLIENT_TOKEN,
} from '@src/modules/core/auth/constants/auth.constant';
import { AuthHelper } from '@src/modules/core/auth/helpers/auth.helper';
import { JwtStrategy } from '@src/modules/core/auth/jwt/jwt.strategy';
import { OptionalJwtStrategy } from '@src/modules/core/auth/jwt/optional-jwt.strategy';
import { AuthService } from '@src/modules/core/auth/services/auth.service';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { HttpConfigModule } from '@src/modules/core/http/http-config.module';
import { ENV_KEY } from '@src/modules/core/the-pool-config/constants/the-pool-config.constant';
import { ThePoolConfigService } from '@src/modules/core/the-pool-config/services/the-pool-config.service';
import { OAuth2Client } from 'google-auth-library';
import jwksClient from 'jwks-rsa';

@Module({
  imports: [
    HttpConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (thePoolConfigService: ThePoolConfigService) => {
        return {
          secret: thePoolConfigService.get<string>(ENV_KEY.SECRET_KEY),
          signOptions: {
            expiresIn: '10y',
          },
        };
      },
      inject: [ThePoolConfigService],
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    OptionalJwtStrategy,
    PrismaService,
    AuthHelper,
    CommonHelper,
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
