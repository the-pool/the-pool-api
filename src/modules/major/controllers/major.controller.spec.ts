import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MajorIdRequestParamDto } from '@src/modules/major/dtos/major-id-request-param.dto';
import { MajorRelationFieldRequestQueryDto } from '@src/modules/major/dtos/major-relation-field-request-query.dto';
import { MajorRequestParamDto } from '@src/modules/major/dtos/major-request-param.dto';
import { MajorSkillListDto } from '@src/modules/major/dtos/major-skill-list.dto';
import { MajorSkillDto } from '@src/modules/major/dtos/major-skill.dto';
import { MajorDto } from '@src/modules/major/dtos/major.dto';
import { MajorListDto } from '@src/modules/major/dtos/majorListDto';
import { MajorSkillEntity } from '@src/modules/major/entities/major-skill.entity';
import { MajorEntity } from '@src/modules/major/entities/major.entity';
import { plainToInstance } from 'class-transformer';
import { mockMajorService } from '../../../../test/mock/mock-services';
import { MajorService } from '../services/major.service';
import { MajorController } from './major.controller';

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

  describe('findMajors - 분야 리스트 조회', () => {
    let query: MajorRelationFieldRequestQueryDto;
    const mockMajors: MajorEntity[] = [
      plainToInstance(MajorEntity, JSON.parse(faker.datatype.json())),
    ];

    beforeEach(() => {
      query = new MajorRelationFieldRequestQueryDto();
      query.majorSkills = faker.datatype.boolean();
      mockMajorService.findMajors.mockReturnValue(mockMajors);
    });

    it('routing + plain object to class object converting 기능만 한다.', async () => {
      const result: MajorListDto = await controller.findMajors(query);

      expect(mockMajorService.findMajors).toHaveBeenCalledTimes(1);
      expect(mockMajorService.findMajors).toBeCalledWith(query);
      expect(result).toBeInstanceOf(MajorListDto);
      expect(result.majors).toStrictEqual(mockMajors);
    });
  });

  describe('findMajor - 분야 단일 조회', () => {
    let query: MajorRelationFieldRequestQueryDto;
    let param: MajorIdRequestParamDto;
    let mockMajor: MajorEntity;

    beforeEach(() => {
      query = new MajorRelationFieldRequestQueryDto();
      param = new MajorIdRequestParamDto();
      query.majorSkills = faker.datatype.boolean();
      param.majorId = faker.datatype.number();
      mockMajor = plainToInstance(
        MajorEntity,
        JSON.parse(faker.datatype.json()),
      );

      mockMajorService.findMajor.mockReturnValue(mockMajor);
    });

    it('routing + plain object to class object converting 기능만 한다.', async () => {
      const result: MajorDto = await controller.findMajor(param, query);

      expect(mockMajorService.findMajor).toHaveBeenCalledTimes(1);
      expect(mockMajorService.findMajor).toBeCalledWith(param.majorId, query);
      expect(result).toBeInstanceOf(MajorDto);
      expect(result.major).toStrictEqual(mockMajor);
    });
  });

  describe('findMajorSkills - 분야의 스킬 리스트 조회', () => {
    let param: MajorIdRequestParamDto;
    let mockMajorSkills: MajorSkillEntity[];

    beforeEach(() => {
      param = new MajorIdRequestParamDto();
      param.majorId = faker.datatype.number();
      mockMajorSkills = [
        plainToInstance(MajorSkillEntity, JSON.parse(faker.datatype.json())),
      ];

      mockMajorService.findMajorSkills.mockReturnValue(mockMajorSkills);
    });

    it('routing + plain object to class object converting 기능만 한다.', async () => {
      const result: MajorSkillListDto = await controller.findMajorSkills(param);

      expect(mockMajorService.findMajorSkills).toHaveBeenCalledTimes(1);
      expect(mockMajorService.findMajorSkills).toBeCalledWith(param.majorId);
      expect(result).toBeInstanceOf(MajorSkillListDto);
      expect(result.majorSkills).toStrictEqual(mockMajorSkills);
    });
  });

  describe('findMajorSkill - 분야의 스킬 단일 조회', () => {
    let param: MajorRequestParamDto;
    let mockMajorSkill: MajorSkillEntity;

    beforeEach(() => {
      param = new MajorRequestParamDto();
      param.majorId = faker.datatype.number();
      param.majorSkillId = faker.datatype.number();
      mockMajorSkill = plainToInstance(
        MajorSkillEntity,
        JSON.parse(faker.datatype.json()),
      );

      mockMajorService.findMajorSkill.mockReturnValue(mockMajorSkill);
    });

    it('routing + plain object to class object converting 기능만 한다.', async () => {
      const result: MajorSkillDto = await controller.findMajorSkill(param);

      expect(mockMajorService.findMajorSkill).toHaveBeenCalledTimes(1);
      expect(mockMajorService.findMajorSkill).toBeCalledWith(
        param.majorId,
        param.majorSkillId,
      );
      expect(result).toBeInstanceOf(MajorSkillDto);
      expect(result.majorSkill).toStrictEqual(mockMajorSkill);
    });
  });
});
