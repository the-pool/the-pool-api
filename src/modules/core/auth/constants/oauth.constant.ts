import { OAuthAgency } from './oauth.enums';

export const OAUTH_AGENCY_COLUMN = {
  [OAuthAgency.Kakao]: 'k',
  [OAuthAgency.Google]: 'g',
  [OAuthAgency.Apple]: 'a',
};
