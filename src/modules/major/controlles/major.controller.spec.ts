import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MainSkillDto } from '@src/modules/major/dto/main-skill.dto';
import { MainSkillsDto } from '@src/modules/major/dto/main-skills.dto';
import { MajorIdRequestParamDto } from '@src/modules/major/dto/major-id-request-param.dto';
import { MajorRelationFieldRequestQueryDto } from '@src/modules/major/dto/major-relation-field-request-query.dto';
import { MajorRequestParamDto } from '@src/modules/major/dto/major-request-param.dto';
import { MajorDto } from '@src/modules/major/dto/major.dto';
import { MajorsDto } from '@src/modules/major/dto/majors.dto';
import { MainSkillEntity } from '@src/modules/major/entities/main-skill.entoty';
import { MajorEntity } from '@src/modules/major/entities/major.entity';
import { plainToInstance } from 'class-transformer';
import { mockMajorService } from '../../../../test/mock/mock-service';
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
      query.mainSkills = faker.datatype.boolean();
      mockMajorService.findMajors.mockReturnValue(mockMajors);
    });

    it('routing + plain object to class object converting 기능만 한다.', async () => {
      const result: MajorsDto = await controller.findMajors(query);

      expect(mockMajorService.findMajors).toHaveBeenCalledTimes(1);
      expect(mockMajorService.findMajors).toBeCalledWith(query);
      expect(result).toBeInstanceOf(MajorsDto);
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
      query.mainSkills = faker.datatype.boolean();
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

  describe('findMainSkills - 분야의 스킬 리스트 조회', () => {
    let param: MajorIdRequestParamDto;
    let mockMainSkills: MainSkillEntity[];

    beforeEach(() => {
      param = new MajorIdRequestParamDto();
      param.majorId = faker.datatype.number();
      mockMainSkills = [
        plainToInstance(MainSkillEntity, JSON.parse(faker.datatype.json())),
      ];

      mockMajorService.findMainSkills.mockReturnValue(mockMainSkills);
    });

    it('routing + plain object to class object converting 기능만 한다.', async () => {
      const result: MainSkillsDto = await controller.findMainSkills(param);

      expect(mockMajorService.findMainSkills).toHaveBeenCalledTimes(1);
      expect(mockMajorService.findMainSkills).toBeCalledWith(param.majorId);
      expect(result).toBeInstanceOf(MainSkillsDto);
      expect(result.mainSkills).toStrictEqual(mockMainSkills);
    });
  });

  describe('findMainSkill - 분야의 스킬 단일 조회', () => {
    let param: MajorRequestParamDto;
    let mockMainSkill: MainSkillEntity;

    beforeEach(() => {
      param = new MajorRequestParamDto();
      param.majorId = faker.datatype.number();
      param.mainSkillId = faker.datatype.number();
      mockMainSkill = plainToInstance(
        MainSkillEntity,
        JSON.parse(faker.datatype.json()),
      );

      mockMajorService.findMainSkill.mockReturnValue(mockMainSkill);
    });

    it('routing + plain object to class object converting 기능만 한다.', async () => {
      const result: MainSkillDto = await controller.findMainSkill(param);

      expect(mockMajorService.findMainSkill).toHaveBeenCalledTimes(1);
      expect(mockMajorService.findMainSkill).toBeCalledWith(
        param.majorId,
        param.mainSkillId,
      );
      expect(result).toBeInstanceOf(MainSkillDto);
      expect(result.mainSkill).toStrictEqual(mockMainSkill);
    });
  });
});
