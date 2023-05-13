import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MajorController } from '@src/modules/major/controllers/major.controller';
import { MajorIdRequestParamDto } from '@src/modules/major/dtos/major-id-request-param.dto';
import { MajorRelationFieldRequestQueryDto } from '@src/modules/major/dtos/major-relation-field-request-query.dto';
import { MajorRequestParamDto } from '@src/modules/major/dtos/major-request-param.dto';
import { MajorSkillDto } from '@src/modules/major/dtos/major-skill-dto';
import { MajorDto } from '@src/modules/major/dtos/major.dto';
import { MajorService } from '@src/modules/major/services/major.service';
import { mockMajorService } from '@test/mock/mock-services';

describe('MajorController', () => {
  let controller: MajorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MajorController],
      providers: [
        {
          provide: MajorService,
          useValue: mockMajorService,
        },
      ],
    }).compile();

    controller = module.get<MajorController>(MajorController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAllMajor - 분야 리스트 조회', () => {
    let query: MajorRelationFieldRequestQueryDto;
    const mockMajors: MajorDto[] = [JSON.parse(faker.datatype.json())];

    beforeEach(() => {
      query = new MajorRelationFieldRequestQueryDto();
      query.majorSkills = faker.datatype.boolean();
      mockMajorService.findAllMajor.mockResolvedValue(mockMajors);
    });

    it('routing 기능만 한다.', async () => {
      await expect(controller.findAllMajor(query)).resolves.toStrictEqual(
        mockMajors,
      );
      expect(mockMajorService.findAllMajor).toBeCalledWith(query);
    });
  });

  describe('findOneMajor - 분야 단일 조회', () => {
    let query: MajorRelationFieldRequestQueryDto;
    let param: MajorIdRequestParamDto;
    let mockMajor: MajorDto;

    beforeEach(() => {
      query = new MajorRelationFieldRequestQueryDto();
      param = new MajorIdRequestParamDto();
      query.majorSkills = faker.datatype.boolean();
      param.majorId = faker.datatype.number();
      mockMajor = JSON.parse(faker.datatype.json());

      mockMajorService.findOneMajorOrThrow.mockResolvedValue(mockMajor);
    });

    it('routing 기능만 한다.', async () => {
      await expect(
        controller.findOneMajor(param, query),
      ).resolves.toStrictEqual(mockMajor);
      expect(mockMajorService.findOneMajorOrThrow).toBeCalledWith(
        param.majorId,
        query,
      );
    });
  });

  describe('findAllMajorSkill - 분야의 스킬 리스트 조회', () => {
    let param: MajorIdRequestParamDto;
    let mockMajorSkills: MajorSkillDto[];

    beforeEach(() => {
      param = new MajorIdRequestParamDto();
      param.majorId = faker.datatype.number();
      mockMajorSkills = [JSON.parse(faker.datatype.json())];

      mockMajorService.findAllMajorSkill.mockResolvedValue(mockMajorSkills);
    });

    it('routing 기능만 한다.', async () => {
      await expect(controller.findAllMajorSkill(param)).resolves.toStrictEqual(
        mockMajorSkills,
      );
      expect(mockMajorService.findAllMajorSkill).toBeCalledWith(param.majorId);
    });
  });

  describe('findOneMajorSkill - 분야의 스킬 단일 조회', () => {
    let param: MajorRequestParamDto;
    let mockMajorSkill: MajorSkillDto;

    beforeEach(() => {
      param = new MajorRequestParamDto();
      param.majorId = faker.datatype.number();
      param.majorSkillId = faker.datatype.number();
      mockMajorSkill = JSON.parse(faker.datatype.json());

      mockMajorService.findOneMajorSkillOrThrow.mockResolvedValue(
        mockMajorSkill,
      );
    });

    it('routing 기능만 한다.', async () => {
      await expect(controller.findOneMajorSkill(param)).resolves.toStrictEqual(
        mockMajorSkill,
      );
      expect(mockMajorService.findOneMajorSkillOrThrow).toHaveBeenCalledTimes(
        1,
      );
      expect(mockMajorService.findOneMajorSkillOrThrow).toBeCalledWith(
        param.majorId,
        param.majorSkillId,
      );
    });
  });
});
