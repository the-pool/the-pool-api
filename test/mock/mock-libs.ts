import Mock = jest.Mock;
import { EventEmitter2 } from '@nestjs/event-emitter';

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

export const mockEventEmitter2: {
  [key in keyof EventEmitter2]: Mock;
} = {
  emit: jest.fn(),
  emitAsync: jest.fn(),
  addListener: jest.fn(),
  on: jest.fn(),
  prependListener: jest.fn(),
  once: jest.fn(),
  prependOnceListener: jest.fn(),
  many: jest.fn(),
  prependMany: jest.fn(),
  onAny: jest.fn(),
  prependAny: jest.fn(),
  offAny: jest.fn(),
  removeListener: jest.fn(),
  off: jest.fn(),
  removeAllListeners: jest.fn(),
  setMaxListeners: jest.fn(),
  getMaxListeners: jest.fn(),
  eventNames: jest.fn(),
  listenerCount: jest.fn(),
  listeners: jest.fn(),
  listenersAny: jest.fn(),
  waitFor: jest.fn(),
  listenTo: jest.fn(),
  stopListeningTo: jest.fn(),
  hasListeners: jest.fn(),
};
