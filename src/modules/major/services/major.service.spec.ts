import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MajorRelationFieldRequestQueryDto } from '@src/modules/major/dto/major-relation-field-request-query.dto';
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
          useValue: prismaMock,
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

  describe('findMajors - 분야 리스트 조회', () => {
    let mockMajors: MajorEntity[];
    let query: MajorRelationFieldRequestQueryDto;

    beforeEach(() => {
      mockMajors = [new MajorEntity()];
      query = new MajorRelationFieldRequestQueryDto();
      query.mainSkills = faker.datatype.boolean();
    });

    it('넘어온 query 를 prismaService 에 전달해주는 역할만 함', async () => {
      const result: MajorEntity[] = await service.findMajors(query);

      expect(mockPrismaService.major.findMany).toBeCalledTimes(1);
      expect(mockPrismaService.major.findMany).toBeCalledWith({
        include: { mainSkills: query.mainSkills },
      });
      expect(result).toStrictEqual(mockMajors);
    });
  });
});
