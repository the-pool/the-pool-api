import { DataStructureHelper } from '@src/helpers/data-structure.helper';
import { PrismaHelper } from '@src/modules/core/database/prisma/prisma.helper';
import { MockClassType } from './mock.type';

export const mockPrismaHelper: MockClassType<PrismaHelper> = {
  findOneOrFail: jest.fn(),
};

export const mockDataStructureHelper: MockClassType<DataStructureHelper> = {
  createManyMapper: jest.fn(),
};
