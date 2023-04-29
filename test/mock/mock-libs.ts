import Mock = jest.Mock;

export const mockGoogleAuth: { [key: string]: Mock } = {
  getTokenInfo: jest.fn(),
};

export const mockJwksClient: { [key: string]: Mock } = {
  getSigningKey: jest.fn(),
};

export const mockReflector = {
  get: jest.fn(),
};

export const mockRequest = {
  user: <any>undefined,
  params: <any>undefined,
};

export const mockHttpArgumentHost = {
  getRequest() {
    return mockRequest;
  },
};

export const mockContext = {
  switchToHttp() {
    return mockHttpArgumentHost;
  },
  getHandler() {
    return jest.fn();
  },
};

export const mockEventEmitter = {
  emit: jest.fn(),
};

export class MockEmbedBuilder {
  setTitle() {
    return this;
  }

  setColor() {
    return this;
  }

  setTimestamp() {
    return this;
  }

  setFields() {
    return this;
  }

  setDescription() {
    return this;
  }
}

export class MockWebhookClient {
  constructor(option) {}

  send() {
    return Promise.resolve(jest.fn());
  }
}
