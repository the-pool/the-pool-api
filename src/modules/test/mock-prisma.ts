export const MockPrismaService = {
  member: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),

    updat: jest.fn(),
  },

  memberSkill: {
    deleteMany: jest.fn(),
    createMany: jest.fn(),
  },
};
