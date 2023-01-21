import { faker } from '@faker-js/faker';
import { HttpModule, HttpService } from '@nestjs/axios';
import { AxiosResponse } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces';
import { Test, TestingModule } from '@nestjs/testing';
import {
  GOOGLE_O_AUTH2_CLIENT_TOKEN,
  JWKS_CLIENT_TOKEN,
} from '@src/modules/core/auth/constants/auth.constant';
import { KakaoErrorCode } from '@src/modules/core/auth/constants/auth.enum';
import { AuthHelper } from '@src/modules/core/auth/helpers/auth.helper';
import { MEMBER_ACCOUNT_PREFIX } from '@src/modules/member/constants/member.const';
import { MemberLoginType } from '@src/modules/member/constants/member.enum';
import jwt from 'jsonwebtoken';
import { of, throwError } from 'rxjs';
import {
  mockGoogleAuth,
  mockJwksClient,
} from '../../../../../test/mock/mock-libs';

jest.mock('jsonwebtoken');

describe('AuthHelper', () => {
  let authHelper: AuthHelper;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        AuthHelper,
        {
          provide: GOOGLE_O_AUTH2_CLIENT_TOKEN,
          useValue: mockGoogleAuth,
        },
        {
          provide: JWKS_CLIENT_TOKEN,
          useValue: mockJwksClient,
        },
      ],
    }).compile();

    authHelper = module.get<AuthHelper>(AuthHelper);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(authHelper).toBeDefined();
  });

  describe('validateKakaoAccessTokenOrFail', () => {
    let accessToken: string;
    let id: number;
    const successResponse: AxiosResponse = {
      data: {
        id: undefined,
      },
      status: 200,
      headers: {},
      config: { url: 'http://localhost:3000/mockUrl' },
      statusText: 'OK',
    };
    const failureResponse: any = {
      response: {
        data: {
          code: undefined,
        },
      },
    };

    beforeEach(() => {
      accessToken = faker.datatype.string();
    });

    it('성공하는 경우', async () => {
      id = faker.datatype.number();
      successResponse.data.id = id;

      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => of(successResponse));

      const result = await authHelper.validateKakaoAccessTokenOrFail(
        accessToken,
      );

      expect(result).toBe(
        MEMBER_ACCOUNT_PREFIX[MemberLoginType.Kakao] + String(id),
      );
    });

    it('유효하지 않은 토큰', async () => {
      failureResponse.response.data.code = KakaoErrorCode.Unauthorized;

      jest.spyOn(httpService, 'get').mockImplementationOnce(() =>
        throwError(() => {
          return failureResponse;
        }),
      );

      await expect(async () => {
        await authHelper.validateKakaoAccessTokenOrFail(accessToken);
      }).rejects.toThrowError('유효하지 않은 토큰입니다.');
    });

    it('카카오 서버 장애', async () => {
      failureResponse.response.data.code = KakaoErrorCode.InternalServerError;

      jest.spyOn(httpService, 'get').mockImplementationOnce(() =>
        throwError(() => {
          return failureResponse;
        }),
      );

      await expect(async () => {
        await authHelper.validateKakaoAccessTokenOrFail(accessToken);
      }).rejects.toThrowError(
        '카카오 서버의 일시적인 장애 잠시후 다시 요청해주세요.',
      );
    });

    it('카카오 스펙에 맞지 않는 값 우리 서버 문제', async () => {
      failureResponse.response.data.code = KakaoErrorCode.InvalidRequestForm;

      jest.spyOn(httpService, 'get').mockImplementationOnce(() =>
        throwError(() => {
          return failureResponse;
        }),
      );

      await expect(async () => {
        await authHelper.validateKakaoAccessTokenOrFail(accessToken);
      }).rejects.toThrowError();
    });

    it('그 외 예상치 못한 문제', async () => {
      jest.spyOn(httpService, 'get').mockImplementationOnce(() =>
        throwError(() => {
          return failureResponse;
        }),
      );

      await expect(async () => {
        await authHelper.validateKakaoAccessTokenOrFail(accessToken);
      }).rejects.toThrowError();
    });
  });

  describe('validateGoogleAccessTokenOrFail', () => {
    let accessToken: string;

    beforeEach(() => {
      accessToken = faker.datatype.string();
    });

    it('성공하는 경우', async () => {
      const aud = faker.datatype.number();
      const response = {
        aud,
      };

      mockGoogleAuth.getTokenInfo.mockReturnValue(response);

      const result = await authHelper.validateGoogleAccessTokenOrFail(
        accessToken,
      );

      expect(result).toStrictEqual(
        MEMBER_ACCOUNT_PREFIX[MemberLoginType.Google] + aud,
      );
    });

    it('유효하지 않은 토큰', async () => {
      mockGoogleAuth.getTokenInfo.mockRejectedValueOnce('');

      await expect(async () => {
        await authHelper.validateGoogleAccessTokenOrFail(accessToken);
      }).rejects.toThrowError('유효하지 않은 토큰입니다.');
    });
  });

  describe('validateAppleAccessTokenOrFail', () => {
    let accessToken;

    beforeEach(() => {
      accessToken = faker.datatype.string();
      mockJwksClient.getSigningKey.mockReturnValue({
        getPublicKey: jest.fn().mockReturnValue(faker.datatype.string()),
      });
    });

    it('성공하는 경우', async () => {
      const sub = faker.datatype.number();

      jest.spyOn(jwt, 'decode').mockImplementationOnce(() => {
        return {
          header: {
            kid: faker.datatype.number({ min: 1 }),
          },
        };
      });
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        return {
          payload: {
            nonce_supported: true,
            aud: 'com.thepool.web',
            iss: 'https://appleid.apple.com',
            sub,
          },
        };
      });

      const result = await authHelper.validateAppleAccessTokenOrFail(
        accessToken,
      );

      expect(result).toBe(MEMBER_ACCOUNT_PREFIX[MemberLoginType.Apple] + sub);
    });

    it('애플에서 발급하지 않았거나 jwt 토큰이 아닌 경우', async () => {
      jest.spyOn(jwt, 'decode').mockImplementationOnce(() => '');

      await expect(async () => {
        await authHelper.validateAppleAccessTokenOrFail(accessToken);
      }).rejects.toThrowError('유효하지 않은 토큰입니다.');
    });

    it('애플에서 발급받은 jwt 토큰이지만 유효하지 않을 경우', async () => {
      const sub = faker.datatype.number();

      jest.spyOn(jwt, 'decode').mockImplementationOnce(() => {
        return {
          header: {
            kid: faker.datatype.number({ min: 1 }),
          },
        };
      });
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        return {
          payload: {
            nonce_supported: false,
            aud: 'com.thepool.web',
            iss: 'https://appleid.apple.com',
            sub,
          },
        };
      });

      await expect(async () => {
        await authHelper.validateAppleAccessTokenOrFail(accessToken);
      }).rejects.toThrowError('유효하지 않은 토큰');
    });
  });
});
