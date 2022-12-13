import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MajorRelationFieldRequestQueryDto } from '@src/modules/major/dtos/major-relation-field-request-query.dto';
import { MainSkillEntity } from '@src/modules/major/entities/main-skill.entity';
import { MajorEntity } from '@src/modules/major/entities/major.entity';
import { mockPrismaService } from '../../../../test/mock/mock-prisma-service';
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

  describe('findMajors - 분야 리스트 조회', () => {
    let mockMajors: MajorEntity[];
    let query: MajorRelationFieldRequestQueryDto;

    beforeEach(() => {
      mockMajors = [new MajorEntity()];
      query = new MajorRelationFieldRequestQueryDto();
      query.mainSkills = faker.datatype.boolean();
      mockPrismaService.major.findMany.mockResolvedValueOnce(mockMajors);
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

  describe('findMajor - 분야 단일 조회', () => {
    let mockMajor: MajorEntity;
    let majorId: number;
    let query: MajorRelationFieldRequestQueryDto;

    beforeEach(() => {
      mockMajor = new MajorEntity();
      majorId = faker.datatype.number();
      query = new MajorRelationFieldRequestQueryDto();
      query.mainSkills = faker.datatype.boolean();
      mockPrismaService.major.findUnique.mockResolvedValueOnce(mockMajor);
    });

    it('넘어온 query 를 prismaService 에 전달해주는 역할만 함', async () => {
      const result: MajorEntity = await service.findMajor(majorId, query);

      expect(mockPrismaService.major.findUnique).toBeCalledTimes(1);
      expect(mockPrismaService.major.findUnique).toBeCalledWith({
        where: {
          id: majorId,
        },
        include: {
          mainSkills: query.mainSkills,
        },
      });
      expect(result).toStrictEqual(mockMajor);
    });
  });

  describe('findMainSkills - 메인 스킬 리스트 조회', () => {
    let mockMainSkills: MainSkillEntity[];
    let majorId: number;

    beforeEach(() => {
      mockMainSkills = [new MainSkillEntity()];
      majorId = faker.datatype.number();
      mockPrismaService.mainSkill.findMany.mockResolvedValueOnce(
        mockMainSkills,
      );
    });

    it('넘어온 query 를 prismaService 에 전달해주는 역할만 함', async () => {
      const result: MainSkillEntity[] = await service.findMainSkills(majorId);

      expect(mockPrismaService.mainSkill.findMany).toBeCalledTimes(1);
      expect(mockPrismaService.mainSkill.findMany).toBeCalledWith({
        where: {
          majorId,
        },
      });
      expect(result).toStrictEqual(mockMainSkills);
    });
  });

  describe('findMainSkill - 메인 스킬 단일 조회', () => {
    let mockMainSkill: MainSkillEntity;
    let majorId: number;
    let mainSkillId: number;

    beforeEach(() => {
      mockMainSkill = new MainSkillEntity();
      majorId = faker.datatype.number();
      mainSkillId = faker.datatype.number();
      mockPrismaService.mainSkill.findUnique.mockResolvedValueOnce(
        mockMainSkill,
      );
    });

    it('넘어온 query 를 prismaService 에 전달해주는 역할만 함', async () => {
      const result: MainSkillEntity = await service.findMainSkill(
        majorId,
        mainSkillId,
      );

      expect(mockPrismaService.mainSkill.findUnique).toBeCalledTimes(1);
      expect(mockPrismaService.mainSkill.findUnique).toBeCalledWith({
        where: {
          majorId,
          id: mainSkillId,
        },
      });
      expect(result).toStrictEqual(mockMainSkill);
    });
  });
});
