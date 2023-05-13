import { faker } from '@faker-js/faker';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthHelper } from '@src/modules/core/auth/helpers/auth.helper';
import { AuthService } from '@src/modules/core/auth/services/auth.service';
import { MemberLoginType } from '@src/modules/member/constants/member.enum';
import { mockAuthHelper } from '@test/mock/mock-helpers';
import { mockJwtService } from '@test/mock/mock-services';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: HttpService,
          useValue: {},
        },
        {
          provide: AuthHelper,
          useValue: mockAuthHelper,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAccessToken', () => {
    let randomValue;

    beforeEach(() => {
      randomValue = faker.datatype.string();
      mockJwtService.sign.mockReturnValue(randomValue);
    });

    it('토큰 생성 성공', () => {
      const id = faker.datatype.number();

      const result = authService.createAccessToken(id);

      expect(mockJwtService.sign).toBeCalledTimes(1);
      expect(result).toBe(randomValue);
    });
  });

  describe('validateExternalAccessTokenOrFail', () => {
    let oAuthToken;
    let randomValue;

    beforeEach(() => {
      oAuthToken = faker.datatype.string();
      randomValue = faker.datatype.string();
    });

    it('카카오', async () => {
      mockAuthHelper.validateKakaoAccessTokenOrFail.mockReturnValue(
        randomValue,
      );
      const oAuthProvider = MemberLoginType.Kakao;

      const result = await authService.validateExternalAccessTokenOrFail(
        oAuthToken,
        oAuthProvider,
      );

      expect(result).toBe(randomValue);
      expect(mockAuthHelper.validateKakaoAccessTokenOrFail).toBeCalledTimes(1);
    });

    it('구글', async () => {
      mockAuthHelper.validateGoogleAccessTokenOrFail.mockReturnValue(
        randomValue,
      );
      const oAuthProvider = MemberLoginType.Google;

      const result = await authService.validateExternalAccessTokenOrFail(
        oAuthToken,
        oAuthProvider,
      );

      expect(result).toBe(randomValue);
      expect(mockAuthHelper.validateGoogleAccessTokenOrFail).toBeCalledTimes(1);
    });

    it('애플', async () => {
      mockAuthHelper.validateAppleAccessTokenOrFail.mockReturnValue(
        randomValue,
      );
      const oAuthProvider = MemberLoginType.Apple;

      const result = await authService.validateExternalAccessTokenOrFail(
        oAuthToken,
        oAuthProvider,
      );

      expect(result).toBe(randomValue);
      expect(mockAuthHelper.validateAppleAccessTokenOrFail).toBeCalledTimes(1);
    });

    it('깃허브', async () => {
      mockAuthHelper.validateGitHubAccessTokenOrFail.mockReturnValue(
        randomValue,
      );
      const oAuthProvider = MemberLoginType.GitHub;

      const result = await authService.validateExternalAccessTokenOrFail(
        oAuthToken,
        oAuthProvider,
      );

      expect(result).toBe(randomValue);
      expect(mockAuthHelper.validateGitHubAccessTokenOrFail).toBeCalledTimes(1);
    });

    it('혹시 나는 에러', async () => {
      const oAuthProvider = 'undefined';

      await expect(async () => {
        await authService.validateExternalAccessTokenOrFail(
          oAuthToken,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          oAuthProvider,
        );
      }).rejects.toThrowError(
        'validateExternalAccessTokenOrFail 중 유효하지 않은 로그인 타입',
      );
    });
  });
});
