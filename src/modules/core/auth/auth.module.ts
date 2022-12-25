import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthHelper } from '@src/modules/core/auth/helpers/auth.helper';
import { JwtStrategy } from '@src/modules/core/auth/jwt/jwt.strategy';
import { AuthService } from '@src/modules/core/auth/services/auth.service';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
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
  ],
  exports: [AuthService],
})
export class AuthModule {}
