import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { LessonSolutionStatisticsResponseBodyDto } from '@src/modules/solution/dtos/lesson-solution-statistics-response-body.dto';
import { LessonSolutionRepository } from '@src/modules/solution/repositories/lesson-solution.repository';
import { mockLessonSolutionRepository } from '@test/mock/mock-repositories';
import { mockPrismaService } from '../../../../test/mock/mock-prisma-service';
import { CreateSolutionRequestBodyDto } from '../dtos/create-solution-request-body.dto';
import { SolutionEntity } from '../entities/solution.entity';
import { SolutionService } from './solution.service';

describe('SolutionService', () => {
  let solutionService: SolutionService;
  let prismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SolutionService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: LessonSolutionRepository,
          useValue: mockLessonSolutionRepository,
        },
      ],
    }).compile();

    solutionService = module.get<SolutionService>(SolutionService);
    prismaService = mockPrismaService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(solutionService).toBeDefined();
  });

  describe('Create Lesson Solution', () => {
    let createSolutionDto: CreateSolutionRequestBodyDto;
    let memberId: number;
    let createdSolution: SolutionEntity;

    beforeEach(() => {
      createSolutionDto = new CreateSolutionRequestBodyDto();
      memberId = 1;
      createdSolution = new SolutionEntity();

      prismaService.lessonSolution.create.mockReturnValue(createdSolution);
    });

    it('SUCCESS - Solution Created', async () => {
      const result = await solutionService.createSolution(
        createSolutionDto,
        memberId,
      );

      expect(prismaService.lessonSolution.create).toBeCalledTimes(1);
      expect(result).toStrictEqual(createdSolution);
    });
  });

  describe('findStatisticsByMemberId', () => {
    let memberId: number;
    let statisticsList: LessonSolutionStatisticsResponseBodyDto[];

    beforeEach(() => {
      memberId = faker.datatype.number();
      statisticsList = [new LessonSolutionStatisticsResponseBodyDto()];
    });

    it('조회 성공', async () => {
      mockLessonSolutionRepository.findStatisticsByMemberId.mockResolvedValue(
        statisticsList,
      );

      await expect(
        solutionService.findStatisticsByMemberId(memberId),
      ).resolves.toStrictEqual(statisticsList[0]);
    });
  });
});
