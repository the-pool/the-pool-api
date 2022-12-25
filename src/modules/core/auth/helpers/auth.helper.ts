import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { KakaoErrorCode } from '@src/modules/core/auth/constants/auth.enum';
import { KakaoAccessTokenResponse } from '@src/modules/core/auth/type/auth.type';
import { catchError, lastValueFrom, map } from 'rxjs';

@Injectable()
export class AuthHelper {
  constructor(private readonly httpService: HttpService) {}

  validateKakaoAccessTokenOrFail(
    accessToken: string,
  ): Promise<KakaoAccessTokenResponse> {
    const ajaxConfig = {
      headers: {
        Authorization: 'Bearer' + ' ' + accessToken,
      },
    };

    return lastValueFrom<KakaoAccessTokenResponse>(
      this.httpService
        .get<KakaoAccessTokenResponse>(
          'https://kapi.kakao.com/v1/user/access_token_info',
          ajaxConfig,
        )
        .pipe(
          map((res) => res.data),
          // https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#get-token-info
          catchError((e) => {
            const errorCode: KakaoErrorCode = e.response.data.code;

            // 카카오 서버 장애 경우
            if (errorCode === KakaoErrorCode.InternalServerError) {
              throw new InternalServerErrorException(
                '카카오 서버의 일시적인 장애 잠시후 다시 요청해주세요.',
              );
            }

            // 카카오 open api 스펙에 맞지 않게 보냈을 경우
            if (errorCode === KakaoErrorCode.InvalidRequestForm) {
              throw new InternalServerErrorException(e);
            }

            // 유효하지 않은 토큰일 경우
            if (errorCode === KakaoErrorCode.Unauthorized) {
              throw new UnauthorizedException('유효하지 않은 토큰입니다.');
            }

            // 그 외 에러
            throw new InternalServerErrorException(e);
          }),
        ),
    );
  }

  validateGoogleAccessToken(accessToken: string) {}

  validateAppleAccessToken(accessToken: string) {}
}
