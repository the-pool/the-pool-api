import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MajorRelationFieldRequestQueryDto } from '@src/modules/major/dtos/major-relation-field-request-query.dto';
import { MajorSkillEntity } from '@src/modules/major/entities/major-skill.entity';
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
      query.majorSkills = faker.datatype.boolean();
      mockPrismaService.major.findMany.mockResolvedValueOnce(mockMajors);
    });

    it('넘어온 query 를 prismaService 에 전달해주는 역할만 함', async () => {
      const result: MajorEntity[] = await service.findMajors(query);

      expect(mockPrismaService.major.findMany).toBeCalledTimes(1);
      expect(mockPrismaService.major.findMany).toBeCalledWith({
        include: { majorSkills: query.majorSkills },
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
      query.majorSkills = faker.datatype.boolean();
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
          majorSkills: query.majorSkills,
        },
      });
      expect(result).toStrictEqual(mockMajor);
    });
  });

  describe('findMajorSkills - 메인 스킬 리스트 조회', () => {
    let mockMajorSkills: MajorSkillEntity[];
    let majorId: number;

    beforeEach(() => {
      mockMajorSkills = [new MajorSkillEntity()];
      majorId = faker.datatype.number();
      mockPrismaService.majorSkill.findMany.mockResolvedValueOnce(
        mockMajorSkills,
      );
    });

    it('넘어온 query 를 prismaService 에 전달해주는 역할만 함', async () => {
      const result: MajorSkillEntity[] = await service.findMajorSkills(majorId);

      expect(mockPrismaService.majorSkill.findMany).toBeCalledTimes(1);
      expect(mockPrismaService.majorSkill.findMany).toBeCalledWith({
        where: {
          majorId,
        },
      });
      expect(result).toStrictEqual(mockMajorSkills);
    });
  });

  describe('findMajorSkill - 메인 스킬 단일 조회', () => {
    let mockMajorSkill: MajorSkillEntity;
    let majorId: number;
    let majorSkillId: number;

    beforeEach(() => {
      mockMajorSkill = new MajorSkillEntity();
      majorId = faker.datatype.number();
      majorSkillId = faker.datatype.number();
      mockPrismaService.majorSkill.findUnique.mockResolvedValueOnce(
        mockMajorSkill,
      );
    });

    it('넘어온 query 를 prismaService 에 전달해주는 역할만 함', async () => {
      const result: MajorSkillEntity = await service.findMajorSkill(
        majorId,
        majorSkillId,
      );

      expect(mockPrismaService.majorSkill.findUnique).toBeCalledTimes(1);
      expect(mockPrismaService.majorSkill.findUnique).toBeCalledWith({
        where: {
          majorId,
          id: majorSkillId,
        },
      });
      expect(result).toStrictEqual(mockMajorSkill);
    });
  });
});
