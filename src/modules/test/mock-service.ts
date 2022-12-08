export const MockMemberService = {
  loginByOAuth: jest.fn(),
  updateMember: jest.fn(),
};

export const MockAuthService = {
  login: jest.fn(),
  createAccessToken: jest.fn(),
  validateOAuth: jest.fn(),
};

export const MockHttpService = {
  get: jest.fn(() => MockAuthService),
  pipe: jest.fn(),
};

export const MockPrivateStorageService = {
  getSignedUrl: jest.fn(),
};

export const mockLessonService = {
  createLesson: jest.fn(),
  updateLesson: jest.fn(),
  updateLessonHashtag: jest.fn(),
  readOneLesson: jest.fn(),
  readSimilarLesson: jest.fn(),
};
