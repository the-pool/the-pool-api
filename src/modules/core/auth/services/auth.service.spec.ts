import { HttpService } from '@nestjs/axios';
import { JwtModule, JwtSecretRequestType, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import jwt from 'jsonwebtoken';
import { faker } from '@faker-js/faker';
import { HttpConfigModule } from '../../http/http-config.module';
import { OAUTH_AGENCY_COLUMN } from '../constants/oauth.constant';
import { UnauthorizedException } from '@nestjs/common';
import { of } from 'rxjs';
import { AxiosResponse } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces';
import exp from 'constants';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let httpService;

  beforeEach(async () => {
    const config = {
      secretOrKeyProvider: (requestType: JwtSecretRequestType) =>
        requestType === JwtSecretRequestType.SIGN
          ? 'sign_secret'
          : 'verify_secret',
      secret: 'default_secret',
      publicKey: 'public_key',
      privateKey: 'private_key',
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register(config), HttpConfigModule],
      providers: [AuthService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(httpService).toBeDefined();
  });

  describe('createAccessToken', () => {
    let signSpy: jest.SpyInstance;
    let testPayload: string = faker.internet.email();

    beforeEach(async () => {
      signSpy = jest
        .spyOn(jwt, 'sign')
        .mockImplementation((token, secret, options, callback) => {
          const result = 'signed_' + token + '_by_' + secret;
          return callback ? callback(null, result) : result;
        });
    });

    afterEach(() => {
      signSpy.mockRestore();
    });

    it('signing should use config.secretOrKeyProvider', async () => {
      expect(jwtService.sign(testPayload)).toBe(
        `signed_${testPayload}_by_sign_secret`,
      );
    });
  });

  describe('validateOAuth', () => {
    let accessToken = 'validatedToken';
    let oAuthAgency = 1;

    it('success', async () => {
      const result: AxiosResponse = {
        data: {
          expiresInMillis: 3295497,
          id: 123456789,
          expires_in: 3295,
          app_id: 811991,
          appId: 811991,
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };
      jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(result));

      const returnValue = await authService.validateOAuth(
        accessToken,
        oAuthAgency,
      );

      expect(typeof returnValue === 'string').toBeTruthy();
      expect(returnValue === OAUTH_AGENCY_COLUMN[oAuthAgency] + result.data.id);
    });

    it('false - 유효하지 않은 토큰을 넘겨 받았을 때', async () => {
      accessToken = 'notValidToken';

      await expect(async () => {
        await authService.validateOAuth(accessToken, oAuthAgency);
      }).rejects.toThrowError(
        new UnauthorizedException('로셜 로그인에 실패하였습니다.'),
      );
    });
  });
});
