import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuthAgency } from '@src/modules/core/auth/constants/oauth.enums';
import { AuthHelper } from '@src/modules/core/auth/helpers/auth.helper';
import { lastValueFrom, map } from 'rxjs';
import { OAUTH_AGENCY_COLUMN } from '../constants/oauth.constant';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly authHelper: AuthHelper,
  ) {}

  login(id: number) {
    const payload = { id };

    return this.jwtService.sign(payload);
  }

  createAccessToken(id: number) {
    const payload = { id };

    return this.jwtService.sign(payload);
  }

  /**
   * 각 인증기관에서 넘어온 access token이 맞는지 검증하는 로직
   */
  async validateOAuth(
    accessToken: string,
    oAuthAgency: number,
  ): Promise<string> {
    try {
      // oAuthAgency에 따른 분기처리는 추후에 추가되는 기관의 ajax요청의 형태에 따라 만들어주겠음
      const ajaxConfig = {
        headers: { Authorization: 'Bearer' + ' ' + accessToken },
      };
      const response: any = await lastValueFrom(
        this.httpService
          .get('https://kapi.kakao.com/v1/user/access_token_info', ajaxConfig)
          .pipe(map((res) => res.data)),
      );

      return OAUTH_AGENCY_COLUMN[oAuthAgency] + response.id;
    } catch (error) {
      throw new UnauthorizedException('소셜 로그인에 실패하였습니다.');
    }
  }

  async validateExternalAccessToken(
    accessToken: string,
    oAuthProvider: OAuthAgency,
  ) {
    if (oAuthProvider === OAuthAgency.Apple) {
    }

    if (oAuthProvider === OAuthAgency.Google) {
    }

    if (oAuthProvider === OAuthAgency.Kakao) {
      return this.authHelper.validateKakaoAccessTokenOrFail('asd');
    }
  }
}
