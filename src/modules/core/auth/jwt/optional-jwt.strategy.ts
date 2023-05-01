import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Member } from '@prisma/client';
import { Strategy } from 'passport-custom';
import { ExtractJwt } from 'passport-jwt';
import { PrismaService } from '../../database/prisma/prisma.service';

/**
 * 회원, 비회원 공통으로 사용되는 api를 위한 가드 (단! 비회원일시 member id를 null로 할당)
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
  async validate(request: any) {
    console.log('request', request);
    const token = this.getToken(request);
    console.log('token', token);
    if (token === null) {
      return { id: null };
    }

    const validatedToken = this.validateToken(token);

    return await this.validateMember(validatedToken.id);
  }

  // request 객체로부터 토큰을 가져오는 메서드
  getToken(request: any) {
    const extractToken = ExtractJwt.fromAuthHeaderAsBearerToken();
    console.log('여기!', ExtractJwt.fromAuthHeaderAsBearerToken());
    return extractToken(request);
  }

  // 토큰의 검증을 위한 메서드
  validateToken(token: string): { id: number } {
    return this.jwtService.verify(token, {
      secret: this.configService.get('SECRET_KEY'),
    });
  }

  // 토큰을 디코딩했을 때 나온 멤버 id 검증을 위한 메서드
  async validateMember(memberId: number) {
    const member: Member | null = await this.prismaService.member.findFirst({
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
