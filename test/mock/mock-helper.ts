import { PrismaHelper } from '@src/modules/core/database/prisma/prisma.helper';
import { MockClassType } from './mock.type';

export const mockPrismaHelper: MockClassType<PrismaHelper> = {
  findOneOrFail: jest.fn(),
};
