import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Member } from '@prisma/client';
import { Strategy } from 'passport-http-bearer';
import { PrismaService } from '../../database/prisma/prisma.service';

/**
 * 회원, 비회원 공통으로 사용되는 api를 위한 가드 (단! 비회원일시 member id를 0으로 할당)
 * 클라이언트 측에서 비회원일시 bearer token에 "nonMember"이라는 string 넣어서 보내주어야 함
 * */
@Injectable()
export class OptionalJwtStrategy extends PassportStrategy(
  Strategy,
  'optional',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {
    super();
  }
  async validate(token: string) {
    if (token === 'nonMember') {
      return { id: 0 };
    }

    const tokenDecode = this.tokenDecode(token);

    return this.validateMember(tokenDecode.id);
  }

  // 토큰의 검증을 위한 메서드
  tokenDecode(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get('SECRET_KEY'),
      });
    } catch (error) {
      // 토큰의 비밀키가 일치하지 않거나 만료시간이 초과된 경우 401에러 return
      if (error.name === 'JsonWebTokenError' || 'TokenExpiredError') {
        throw new UnauthorizedException();
      }
      throw error;
    }
  }

  // 토큰을 디코딩했을 때 나온 멤버 id 검증을 위한 메서드
  async validateMember(memberId: number) {
    const member: Member = await this.prismaService.member.findFirst({
      where: {
        id: memberId,
      },
    });

    if (!member) {
      throw new UnauthorizedException();
    }
    return member;
  }
}
