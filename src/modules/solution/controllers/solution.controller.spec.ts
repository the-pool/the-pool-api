import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { NotificationService } from '@src/modules/core/notification/services/notification.service';
import { mockPrismaService } from '@test/mock/mock-prisma-service';
import {
  mockNotificationService,
  mockSolutionService,
} from '../../../../test/mock/mock-services';
import { CreateSolutionRequestBodyDto } from '../dtos/create-solution-request-body.dto';
import { SolutionEntity } from '../entities/solution.entity';
import { SolutionService } from '../services/solution.service';
import { SolutionController } from './solution.controller';

describe('SolutionController', () => {
  let solutionController: SolutionController;
  let solutionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SolutionController],
      providers: [
        {
          provide: SolutionService,
          useValue: mockSolutionService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    solutionController = module.get<SolutionController>(SolutionController);
    solutionService = mockSolutionService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(solutionController).toBeDefined();
  });

  describe('Create Lesson Solution', () => {
    let createSolutionDto: CreateSolutionRequestBodyDto;
    let memberId: number;
    let solutionEntity: SolutionEntity;

    beforeEach(() => {
      memberId = faker.datatype.number();
      createSolutionDto = {
        lessonId: faker.datatype.number(),
        description: faker.lorem.text(),
        relatedLink: faker.internet.url(),
      };
      solutionEntity = new SolutionEntity();
      solutionService.createSolution.mockReturnValue(solutionEntity);
    });

    it('SUCCESS - Create Solution', async () => {
      const result = await solutionController.createSolution(
        createSolutionDto,
        memberId,
      );

      expect(solutionService.createSolution).toBeCalledTimes(1);
      expect(result).toStrictEqual(solutionEntity);
    });
  });
});
