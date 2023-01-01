import Mock = jest.Mock;

export const mockGoogleAuth: { [key: string]: Mock } = {
  getTokenInfo: jest.fn(),
};

export const mockJwksClient: { [key: string]: Mock } = {
  getSigningKey: jest.fn(),
};
