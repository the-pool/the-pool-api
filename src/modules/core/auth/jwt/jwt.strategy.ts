import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Member } from '@prisma/client';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { ENV_KEY } from '@src/modules/core/the-pool-config/constants/the-pool-config.constant';
import { ThePoolConfigService } from '@src/modules/core/the-pool-config/services/the-pool-config.service';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly thePoolConfigService: ThePoolConfigService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: thePoolConfigService.get<string>(ENV_KEY.SECRET_KEY),
    });
  }

  async validate(payload: any) {
    const member: Member | null = await this.prismaService.member.findFirst({
      where: {
        id: payload.id,
      },
    });

    if (!member) {
      throw new UnauthorizedException();
    }

    return member;
  }
}
