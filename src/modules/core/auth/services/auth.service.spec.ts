import { HttpService } from '@nestjs/axios';
import { JwtModule, JwtSecretRequestType, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import jwt from 'jsonwebtoken';
import { faker } from '@faker-js/faker';
import { HttpConfigModule } from '../../http/http-config.module';
import { OAUTH_AGENCY_COLUMN } from '../constants/oauth.constant';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let httpService: HttpService;

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
      expect(await jwtService.sign(testPayload)).toBe(
        `signed_${testPayload}_by_sign_secret`,
      );
    });
  });

  describe('validateOAuth', () => {
    it('success', async () => {
      const accessToken =
        'dcK4vlgG2uUXejuockfVbj2dZY24xlOrvf4_bHGqCisNHwAAAYQiGn1R';
      const oAuthAgency = 0;
      const returnValue = await authService.validateOAuth(
        accessToken,
        oAuthAgency,
      );

      expect(typeof returnValue === 'string').toBeTruthy();
      expect(returnValue[0] === OAUTH_AGENCY_COLUMN[oAuthAgency]);
    });
  });
});
