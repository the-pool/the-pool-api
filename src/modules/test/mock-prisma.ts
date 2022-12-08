export const mockPrismaService = {
  member: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updat: jest.fn(),
  },

  memberSkill: {
    deleteMany: jest.fn(),
    createMany: jest.fn(),
  },

  lesson: {
    create: jest.fn(),
    updateMany: jest.fn(),
  },

  lessonHashtag: {
    deleteMany: jest.fn(),
    createMany: jest.fn(),
  },
};
