import { OAuthAgency } from './oauth.enums';

/**
 * @deprecated loginByOAuth 삭제되면 같이 삭제
 */
export const OAUTH_AGENCY_COLUMN = {
  [OAuthAgency.Kakao]: 'k',
  [OAuthAgency.Google]: 'g',
  [OAuthAgency.Apple]: 'a',
};
