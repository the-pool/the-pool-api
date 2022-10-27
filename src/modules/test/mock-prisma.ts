import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

// jest.mock('@prisma/client', () => ({
//   __esModule: true,
//   default: mockDeep<PrismaClient>(),
// }));

// const prisma = new PrismaClient();

// beforeEach(() => {
//   mockReset(MockPrismaService);
// });

// export const MockPrismaService =
//   prisma as unknown as DeepMockProxy<PrismaClient>;

export const MockPrismaService = {
  member: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};
