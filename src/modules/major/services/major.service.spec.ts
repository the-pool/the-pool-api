import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MajorRelationFieldRequestQueryDto } from '@src/modules/major/dtos/major-relation-field-request-query.dto';
import { MajorSkillDto } from '@src/modules/major/dtos/major-skill-dto';
import { MajorDto } from '@src/modules/major/dtos/major.dto';
import { mockPrismaService } from '@test/mock/mock-prisma-service';
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

  describe('findAllMajor - 분야 리스트 조회', () => {
    let mockMajors: MajorDto[];
    let query: MajorRelationFieldRequestQueryDto;

    beforeEach(() => {
      mockMajors = [new MajorDto()];
      query = new MajorRelationFieldRequestQueryDto();
      query.majorSkills = faker.datatype.boolean();
      mockPrismaService.major.findMany.mockResolvedValueOnce(mockMajors);
    });

    it('넘어온 query 를 prismaService 에 전달해주는 역할만 함', async () => {
      await expect(service.findAllMajor(query)).resolves.toStrictEqual(
        mockMajors,
      );
      expect(mockPrismaService.major.findMany).toBeCalledWith({
        include: { majorSkills: query.majorSkills },
      });
    });
  });

  describe('findOneMajorOrThrow - 분야 단일 조회', () => {
    let mockMajor: MajorDto;
    let majorId: number;
    let query: MajorRelationFieldRequestQueryDto;

    beforeEach(() => {
      mockMajor = new MajorDto();
      majorId = faker.datatype.number();
      query = new MajorRelationFieldRequestQueryDto();
      query.majorSkills = faker.datatype.boolean();
      mockPrismaService.major.findUniqueOrThrow.mockResolvedValueOnce(
        mockMajor,
      );
    });

    it('넘어온 query 를 prismaService 에 전달해주는 역할만 함', async () => {
      await expect(
        service.findOneMajorOrThrow(majorId, query),
      ).resolves.toStrictEqual(mockMajor);
      expect(mockPrismaService.major.findUniqueOrThrow).toBeCalledWith({
        where: {
          id: majorId,
        },
        include: {
          majorSkills: query.majorSkills,
        },
      });
    });
  });

  describe('findAllMajorSkill - 메인 스킬 리스트 조회', () => {
    let mockMajorSkills: MajorSkillDto[];
    let majorId: number;

    beforeEach(() => {
      mockMajorSkills = [new MajorSkillDto()];
      majorId = faker.datatype.number();
      mockPrismaService.majorSkill.findMany.mockResolvedValueOnce(
        mockMajorSkills,
      );
    });

    it('넘어온 query 를 prismaService 에 전달해주는 역할만 함', async () => {
      await expect(service.findAllMajorSkill(majorId)).resolves.toStrictEqual(
        mockMajorSkills,
      );
      expect(mockPrismaService.majorSkill.findMany).toBeCalledWith({
        where: {
          majorId,
        },
      });
    });
  });

  describe('findOneMajorSkillOrThrow - 메인 스킬 단일 조회', () => {
    let mockMajorSkill: MajorSkillDto;
    let majorId: number;
    let majorSkillId: number;

    beforeEach(() => {
      mockMajorSkill = new MajorSkillDto();
      majorId = faker.datatype.number();
      majorSkillId = faker.datatype.number();
      mockPrismaService.majorSkill.findUniqueOrThrow.mockResolvedValueOnce(
        mockMajorSkill,
      );
    });

    it('넘어온 query 를 prismaService 에 전달해주는 역할만 함', async () => {
      await expect(
        service.findOneMajorSkillOrThrow(majorId, majorSkillId),
      ).resolves.toStrictEqual(mockMajorSkill);
      expect(mockPrismaService.majorSkill.findUniqueOrThrow).toBeCalledWith({
        where: {
          majorId,
          id: majorSkillId,
        },
      });
    });
  });
});
