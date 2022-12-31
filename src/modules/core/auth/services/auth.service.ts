import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthHelper } from '@src/modules/core/auth/helpers/auth.helper';
import { MemberLoginType } from '@src/modules/member/constants/member.enum';
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

  /**
   * 외부에서 받은 access token 검증
   */
  async validateExternalAccessTokenOrFail(
    accessToken: string,
    oAuthProvider: MemberLoginType,
  ): Promise<string> {
    // 카카오
    if (oAuthProvider === MemberLoginType.Kakao) {
      return this.authHelper.validateKakaoAccessTokenOrFail(accessToken);
    }

    // 구글
    if (oAuthProvider === MemberLoginType.Google) {
      return this.authHelper.validateGoogleAccessTokenOrFail(accessToken);
    }

    // 애플
    if (oAuthProvider === MemberLoginType.Apple) {
      return this.authHelper.validateGoogleAccessTokenOrFail(accessToken);
    }

    // 빌드시에 타입이 깨지면 빌드가 안되지만 만약에 상황에 대비해 처리
    throw new InternalServerErrorException(
      'validateExternalAccessTokenOrFail 중 유효하지 않은 로그인 타입',
    );
  }
}
