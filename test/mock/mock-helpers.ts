import { AuthHelper } from '@src/modules/core/auth/helpers/auth.helper';
import { MockClassType } from './mock.type';

export const mockAuthHelper: MockClassType<AuthHelper> = {
  validateKakaoAccessTokenOrFail: jest.fn(),
  validateGoogleAccessTokenOrFail: jest.fn(),
  validateAppleAccessTokenOrFail: jest.fn(),
};
