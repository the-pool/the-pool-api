import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MajorsFindResponseBodyDto } from '@src/modules/major/dto/majors-find-response-body.dto';
import { MajorEntity } from '@src/modules/major/entities/major.entity';
import { plainToInstance } from 'class-transformer';
import { mockMajorService } from '../../../../test/mock/services/mockMajorService';
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

  describe('findAll - 분야 리스트 조회', () => {
    const mockMajors: object = [
      plainToInstance(MajorEntity, JSON.parse(faker.datatype.json())),
    ];

    beforeEach(() => {
      mockMajorService.findAll.mockReturnValue(mockMajors);
    });

    it('성공', async () => {
      const result: MajorsFindResponseBodyDto = await controller.findAll();

      expect(mockMajorService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(MajorsFindResponseBodyDto);
      expect(result.majors).toStrictEqual(mockMajors);
    });
  });
});
