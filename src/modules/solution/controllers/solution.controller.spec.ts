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
import { ReadOneSolutionEntity } from '../entities/read-one-solution.entity';
import { ReadManySolutionRequestQueryDto } from '../dtos/read-many-solution-request-query.dto';
import { ReadManySolutionEntity } from '../entities/read-many-solution.entity';
import { LessonService } from '@src/modules/lesson/services/lesson.service';
import { UpdateSolutionRequestBodyDto } from '../dtos/update-solution-request-body.dto';

describe('SolutionController', () => {
  let solutionController: SolutionController;
  let solutionService;
  let prismaService;

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
    prismaService = mockPrismaService;
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

  describe('update Solution', () => {
    let updateSolutionDto: UpdateSolutionRequestBodyDto;
    let memberId: number;
    let solutionId: number;
    let updatedSolution: SolutionEntity;

    beforeEach(() => {
      memberId = faker.datatype.number();
      solutionId = faker.datatype.number();
      updateSolutionDto = new UpdateSolutionRequestBodyDto();
      updatedSolution = new SolutionEntity();

      solutionService.updateSolution.mockResolvedValue(updatedSolution);
    });

    it('SUCCESS - Update Solution', () => {
      expect(
        solutionController.updateSolution(
          solutionId,
          updateSolutionDto,
          memberId,
        ),
      ).resolves.toStrictEqual(updatedSolution);
    });
  });

  describe('delete Solution', () => {
    let memberId: number;
    let solutionId: number;
    let deletedSolution: SolutionEntity;

    beforeEach(() => {
      memberId = faker.datatype.number();
      solutionId = faker.datatype.number();
      deletedSolution = new SolutionEntity();

      solutionService.deleteSolution.mockResolvedValue(deletedSolution);
    });

    it('SUCCESS - Delete Solution', () => {
      expect(
        solutionController.deleteSolution(solutionId, memberId),
      ).resolves.toStrictEqual(deletedSolution);
    });
  });

  describe('readOneSolution', () => {
    let solutionId: number;
    let member: any;
    let readOneSolution: ReadOneSolutionEntity;

    beforeEach(() => {
      readOneSolution = new ReadOneSolutionEntity();
      solutionId = faker.datatype.number();
      member = {
        id: faker.datatype.number(),
      };

      solutionService.readOneSolution.mockReturnValue(readOneSolution);
    });

    it('SUCCESS - read solution', async () => {
      const result = await solutionController.readOneSolution(
        solutionId,
        member,
      );

      expect(solutionService.readOneSolution).toBeCalledTimes(1);
      expect(solutionService.readOneSolution).toBeCalledWith(
        solutionId,
        member.id,
      );
      expect(result).toStrictEqual({ solution: readOneSolution });
    });
  });

  describe('readManySolution', () => {
    let query: ReadManySolutionRequestQueryDto;
    let readManySolution: {
      solutions: ReadManySolutionEntity[];
      totoalCount: number;
    };

    beforeEach(() => {
      query = new ReadManySolutionRequestQueryDto();
      readManySolution = {
        solutions: [new ReadManySolutionEntity()],
        totoalCount: faker.datatype.number(),
      };

      solutionService.readManySolution.mockReturnValue(readManySolution);
    });

    it('SUCCESS - read many solution', () => {
      const result = solutionController.readManySolution(query);

      expect(solutionService.readManySolution).toBeCalledTimes(1);
      expect(solutionService.readManySolution).toBeCalledWith(query);
      expect(result).toStrictEqual(readManySolution);
    });
  });
});
