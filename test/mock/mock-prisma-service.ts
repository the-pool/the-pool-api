import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';
import prisma from './prisma.client';

jest.mock('./prisma.client', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(mockPrismaService);
});

export const mockPrismaService =
  prisma as unknown as DeepMockProxy<PrismaClient>;
