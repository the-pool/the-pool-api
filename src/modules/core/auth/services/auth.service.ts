import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateMemberByOAuthDto } from '@src/modules/member/dtos/create-member-by-oauth.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  login(id: number) {
    const payload = { id };

    return this.jwtService.sign(payload);
  }

  async validateOAuth(createMemberByOAuthDto: CreateMemberByOAuthDto) {
    /**
     * 각 인증기관에서 넘어온 access token이 맞는지 검증하는 로직 추가
     */
  }
}
