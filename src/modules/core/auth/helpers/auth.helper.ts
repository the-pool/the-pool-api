import { HttpService } from '@nestjs/axios';
import {
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces';
import { CommonHelper } from '@src/helpers/common.helper';
import {
  GOOGLE_O_AUTH2_CLIENT_TOKEN,
  JWKS_CLIENT_TOKEN,
} from '@src/modules/core/auth/constants/auth.constant';
import { KakaoErrorCode } from '@src/modules/core/auth/constants/auth.enum';
import {
  GitHubAccessTokenResponse,
  KakaoAccessTokenResponse,
} from '@src/modules/core/auth/type/auth.type';
import { MEMBER_ACCOUNT_PREFIX } from '@src/modules/member/constants/member.const';
import { MemberLoginType } from '@src/modules/member/constants/member.enum';
import { OAuth2Client, TokenInfo } from 'google-auth-library';
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import JwksRsa, { SigningKey } from 'jwks-rsa';
import { catchError, lastValueFrom, map } from 'rxjs';

@Injectable()
export class AuthHelper {
  private readonly ACCOUNT_SEPARATOR = '-';

  constructor(
    private readonly httpService: HttpService,
    private readonly commonHelper: CommonHelper,
    @Inject(GOOGLE_O_AUTH2_CLIENT_TOKEN)
    private readonly googleAuth: OAuth2Client,
    @Inject(JWKS_CLIENT_TOKEN)
    private readonly jwksClient: JwksRsa.JwksClient,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 카카오 open api 를 통해 검증
   * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#get-token-info
   */
  validateKakaoAccessTokenOrFail(oAuthToken: string): Promise<string> {
    const getAccessTokenUrl =
      'https://kapi.kakao.com/v1/user/access_token_info';
    const ajaxConfig: AxiosRequestConfig = {
      headers: {
        Authorization: 'Bearer' + ' ' + oAuthToken,
      },
    } as const;

    return lastValueFrom<string>(
      this.httpService
        .get<KakaoAccessTokenResponse>(getAccessTokenUrl, ajaxConfig)
        .pipe(
          map((res) => {
            return this.commonHelper.setSeparator(
              this.ACCOUNT_SEPARATOR,
              MEMBER_ACCOUNT_PREFIX[MemberLoginType.Kakao],
              String(res.data.id),
            );
          }),
          catchError((err) => {
            const errorCode: KakaoErrorCode = err.response.data.code;

            // 유효하지 않은 토큰일 경우
            if (errorCode === KakaoErrorCode.Unauthorized) {
              throw new UnauthorizedException('유효하지 않은 토큰입니다.');
            }

            // 카카오 서버 장애 경우
            if (errorCode === KakaoErrorCode.InternalServerError) {
              throw new InternalServerErrorException(
                '카카오 서버의 일시적인 장애 잠시후 다시 요청해주세요.',
              );
            }

            // 카카오 open api 스펙에 맞지 않게 보냈을 경우
            if (errorCode === KakaoErrorCode.InvalidRequestForm) {
              throw new InternalServerErrorException(err);
            }

            // 그 외 에러
            throw new InternalServerErrorException(err);
          }),
        ),
    );
  }

  /**
   * 구글 npm 을 통해 검증
   * api 문서: https://developers.google.com/identity/sign-in/web/backend-auth
   * github: https://github.com/googleapis/google-auth-library-nodejs
   */
  async validateGoogleAccessTokenOrFail(oAuthToken: string): Promise<string> {
    try {
      // 구글 내부 axios gAxios 를 통해 토큰 검증
      // 토큰이 유효하지 않으면 라이브러리 내부에서 에러를 throw 함
      const response: TokenInfo = await this.googleAuth.getTokenInfo(
        oAuthToken,
      );

      return this.commonHelper.setSeparator(
        this.ACCOUNT_SEPARATOR,
        MEMBER_ACCOUNT_PREFIX[MemberLoginType.Google],
        response.aud,
      );
    } catch (err) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }

  /**
   * @todo 클라이언트측에서 애플 클라이언트 아이디 발급받으면 로직 추가
   * 애플은 아래 url 에 설명대로 검증
   * url: https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_rest_api/verifying_a_user
   */
  async validateAppleAccessTokenOrFail(oAuthToken: string): Promise<string> {
    // 애플에 등록되어있는 clientId
    // 나중에 clientId 발급받으면 환경변수로
    // 클라이언트측에서 애플 클라이언트 아이디 발급받으면 로직 추가
    // const appleClientIds: string[] = ['com.thepool.web'];

    // jwt 토큰 decode
    const decodedJwt: Jwt | null = jwt.decode(oAuthToken, {
      complete: true,
    });

    // decode 한 jwt 토큰이 null 이면 유효하지 않은 토큰
    // header.kid 가 존재하지 않으면 애플에서 발급받은 토큰이 아님
    if (!decodedJwt?.header?.kid) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    // kid 를 이용해 공개키 요청
    const applePublicKey: SigningKey = await this.jwksClient.getSigningKey(
      decodedJwt.header.kid,
    );

    // 애플 토큰을 서명할 수 있는 키
    const appleSignKey: string = applePublicKey.getPublicKey();

    // 애플 jwt 토큰 decode
    const { payload }: JwtPayload = jwt.verify(oAuthToken, appleSignKey, {
      complete: true,
    });

    // 아래 조건에 걸린다면 유효하지 않은 토큰
    // 클라이언트측에서 애플 클라이언트 아이디 발급받으면 로직 추가
    if (
      !payload.nonce_supported ||
      // !appleClientIds.includes(payload.aud) ||
      payload.iss !== 'https://appleid.apple.com'
    ) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    return this.commonHelper.setSeparator(
      this.ACCOUNT_SEPARATOR,
      MEMBER_ACCOUNT_PREFIX[MemberLoginType.Apple],
      payload.sub,
    );
  }

  /**
   * @todo 디바이스를 통한 인증 추가
   * 깃헙은 아래 플로우를 따름
   * https://docs.github.com/ko/developers/apps/building-oauth-apps/authorizing-oauth-apps
   */
  async validateGitHubAccessTokenOrFail(code: string): Promise<string> {
    const getAccessTokenUrl = 'https://github.com/login/oauth/access_token';

    const tokenInfo = await lastValueFrom<{
      access_token: string;
      token_type: string;
      scope: string;
    }>(
      this.httpService
        .post<Record<string, string>>(
          getAccessTokenUrl,
          {
            client_id: this.configService.get('CLIENT_ID_GITHUB'),
            client_secret: this.configService.get('CLIENT_SECRET_GITHUB'),
            code,
          },
          {
            headers: {
              Accept: 'application/json',
            },
          },
        )
        .pipe(
          map((res) => {
            // 이 api 는 실패시에도 200으로 내려줌
            if (res.data.error) {
              // log 확인을 위한 logging
              console.info(res.data.error);
              throw new UnauthorizedException('유효하지 않은 토큰입니다.');
            }

            return {
              access_token: res.data.access_token,
              token_type: res.data.token_type,
              scope: res.data.scope,
            };
          }),
          catchError((err) => {
            const status: number = err.status || err.response?.status;

            // 유효하지 않은 토큰 401 에러
            if (status === HttpStatus.UNAUTHORIZED) {
              throw new UnauthorizedException('유효하지 않은 토큰입니다.');
            }

            // 그 외 에러
            throw new InternalServerErrorException(err);
          }),
        ),
    );

    const getUserInfoUrl = 'https://api.github.com/user';
    const ajaxConfig: AxiosRequestConfig = {
      headers: {
        Authorization: tokenInfo.token_type + ' ' + tokenInfo.access_token,
      },
    } as const;

    return lastValueFrom<string>(
      this.httpService
        .get<GitHubAccessTokenResponse>(getUserInfoUrl, ajaxConfig)
        .pipe(
          map((res) => {
            return this.commonHelper.setSeparator(
              this.ACCOUNT_SEPARATOR,
              MEMBER_ACCOUNT_PREFIX[MemberLoginType.GitHub],
              String(res.data.id),
            );
          }),
          catchError((err) => {
            const status: number = err.response.status;

            // 유효하지 않은 토큰 401 에러
            if (status === HttpStatus.UNAUTHORIZED) {
              throw new UnauthorizedException('유효하지 않은 토큰입니다.');
            }
            // 그 외 에러
            throw new InternalServerErrorException(err);
          }),
        ),
    );
  }
}
