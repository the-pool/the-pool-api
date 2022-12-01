import { Module } from '@nestjs/common';
import { AuthService } from '@src/modules/core/auth/services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '@src/modules/core/auth/jwt/jwt.strategy';
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
  providers: [AuthService, JwtStrategy, OptionalJwtStrategy, PrismaService],
  exports: [AuthService],
})
export class AuthModule {}
