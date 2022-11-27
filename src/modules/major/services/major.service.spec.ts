import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MajorEntity } from '@src/modules/major/entities/major.entity';
import { mockPrismaService } from '@src/modules/test/mock-prisma';
import { MajorService } from './major.service';

describe('MajorService', () => {
  let service: MajorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MajorService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<MajorService>(MajorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll - 분야 리스트 조회', () => {
    const mockMajors: object = [JSON.parse(faker.datatype.json())];

    beforeEach(() => {
      mockPrismaService.major.findMany.mockReturnValue(mockMajors);
    });

    it('성공', async () => {
      const result: MajorEntity[] = await service.findAll();

      expect(mockPrismaService.major.findMany).toBeCalledTimes(1);
      expect(result).toStrictEqual(mockMajors);
    });
  });
});
