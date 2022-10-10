import { Module } from '@nestjs/common';
import { AuthService } from '@src/modules/core/auth/services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '@src/modules/core/auth/jwt/jwt.strategy';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';

@Module({
  imports: [
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
  providers: [AuthService, JwtStrategy, PrismaService],
  exports: [AuthService],
})
export class AuthModule {}
