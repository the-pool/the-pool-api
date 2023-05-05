import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { SolutionController } from '@src/modules/solution/controllers/solution.controller';
import { CreateSolutionRequestBodyDto } from '@src/modules/solution/dtos/create-solution-request-body.dto';
import { ReadManySolutionRequestQueryDto } from '@src/modules/solution/dtos/read-many-solution-request-query.dto';
import { UpdateSolutionRequestBodyDto } from '@src/modules/solution/dtos/update-solution-request-body.dto';
import { ReadManySolutionEntity } from '@src/modules/solution/entities/read-many-solution.entity';
import { ReadOneSolutionEntity } from '@src/modules/solution/entities/read-one-solution.entity';
import { SolutionEntity } from '@src/modules/solution/entities/solution.entity';
import { SolutionService } from '@src/modules/solution/services/solution.service';
import { mockPrismaService } from '@test/mock/mock-prisma-service';
import { mockSolutionService } from '@test/mock/mock-services';

describe('SolutionController', () => {
  let solutionController: SolutionController;
  let solutionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SolutionController],
      providers: [
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: SolutionService,
          useValue: mockSolutionService,
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
