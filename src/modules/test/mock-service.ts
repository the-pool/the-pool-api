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

<<<<<<< HEAD
export const MockPrivateStorageService = {
  getSignedUrl: jest.fn(),
=======
export const MockLessonService = {
  createLesson: jest.fn(),
  updateLesson: jest.fn(),
  updateLessonHashtag: jest.fn(),
>>>>>>> e26ae18cffb26320d1aff7e131eaa694da494487
};
