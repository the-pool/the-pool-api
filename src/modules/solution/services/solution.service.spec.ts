import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { LessonSolutionStatisticsResponseBodyDto } from '@src/modules/solution/dtos/lesson-solution-statistics-response-body.dto';
import { LessonSolutionRepository } from '@src/modules/solution/repositories/lesson-solution.repository';
import { mockLessonSolutionRepository } from '@test/mock/mock-repositories';
import { mockPrismaService } from '../../../../test/mock/mock-prisma-service';
import { CreateSolutionRequestBodyDto } from '../dtos/create-solution-request-body.dto';
import { SolutionEntity } from '../entities/solution.entity';
import { SolutionService } from './solution.service';
import { faker } from '@faker-js/faker';
import { ReadOneSolutionEntity } from '../entities/read-one-solution.entity';
import { mockQueryHelper } from '@test/mock/mock-helpers';
import { QueryHelper } from '@src/helpers/query.helper';
import { ReadManySolutionRequestQueryDto } from '../dtos/read-many-solution-request-query.dto';
import { ReadManySolutionEntity } from '../entities/read-many-solution.entity';
import { SOLUTION_VIRTUAL_COLUMN_FOR_READ_MANY } from '../constants/solution.const';
import { SolutionVirtualColumn } from '../constants/solution.enum';
import { EntityId } from '@src/constants/enum';
import { UpdateSolutionRequestBodyDto } from '../dtos/update-solution-request-body.dto';

describe('SolutionService', () => {
  let solutionService: SolutionService;
  let prismaService;
  let queryHelper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SolutionService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: QueryHelper,
          useValue: mockQueryHelper,
        },
        {
          provide: LessonSolutionRepository,
          useValue: mockLessonSolutionRepository,
        },
      ],
    }).compile();

    solutionService = module.get<SolutionService>(SolutionService);
    prismaService = mockPrismaService;
    queryHelper = mockQueryHelper;
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

      prismaService.lessonSolution.create.mockResolvedValue(createdSolution);
    });

    it('SUCCESS - Solution Created', async () => {
      expect(
        solutionService.createSolution(createSolutionDto, memberId),
      ).resolves.toStrictEqual(createdSolution);

      expect(prismaService.lessonSolution.create).toBeCalledTimes(1);
    });
  });

  /// UPDATE Solution
  describe('UPDATE Solution', () => {
    let memberId: number | null;
    let solutionId: number;
    let updateRequestDto: UpdateSolutionRequestBodyDto;
    let updatedSolution: SolutionEntity;

    beforeEach(() => {
      memberId = faker.datatype.number();
      solutionId = faker.datatype.number();
      updateRequestDto = new UpdateSolutionRequestBodyDto();
      updatedSolution = new SolutionEntity();

      prismaService.lessonSolution.update.mockResolvedValue(updatedSolution);
    });

    it('SUCCESS - Solution Created', () => {
      expect(
        solutionService.updateSolution(updateRequestDto, solutionId),
      ).resolves.toStrictEqual(updatedSolution);
      expect(prismaService.lessonSolution.update).toBeCalledTimes(1);
    });
  });

  /// DELETE Solution
  describe('DELETE Solution', () => {
    let solutionId: number;
    let deletedSolution: SolutionEntity;

    beforeEach(() => {
      solutionId = faker.datatype.number();
      deletedSolution = new SolutionEntity();

      mockPrismaService.lessonSolution.delete.mockResolvedValue(
        deletedSolution,
      );
    });
  });

  /// GET Solution  One
  describe('GET Solution One', () => {
    let memberId: number | null;
    let solutionId: number;
    let solution;

    beforeEach(() => {
      memberId = faker.datatype.number();
      solutionId = faker.datatype.number();
      solution = new ReadOneSolutionEntity();
      delete solution.isLike;

      prismaService.lessonSolution.findFirst.mockResolvedValue(solution);
    });

    it('SUCCESS - memberId is Null', () => {
      delete solution.lessonSolutionLikes;
      prismaService.lessonSolution.findFirst.mockResolvedValue(solution);

      expect(
        solutionService.readOneSolution(solutionId, null),
      ).resolves.toStrictEqual(solution);
      expect(prismaService.lessonSolution.findFirst).toBeCalledWith({
        where: { id: solutionId },
        include: {
          member: true,
        },
      });
      expect(prismaService.lessonSolution.findFirst).toBeCalledTimes(1);
    });

    it('SUCCESS - has memberId', () => {
      const includeOption = {
        member: true,
        lessonSolutionLikes: {
          where: { memberId },
        },
      };

      expect(
        solutionService.readOneSolution(solutionId, memberId),
      ).resolves.toStrictEqual(solution);
      expect(prismaService.lessonSolution.findFirst).toBeCalledTimes(1);
      expect(prismaService.lessonSolution.findFirst).toBeCalledWith({
        where: { id: solutionId },
        include: includeOption,
      });
    });
  });

  /// GET Solution Many
  describe('GET Solution Many', () => {
    let query: ReadManySolutionRequestQueryDto;
    let readManySolution: ReadManySolutionEntity[];
    let totalCount: number;

    beforeEach(() => {
      query = new ReadManySolutionRequestQueryDto();
      readManySolution = [new ReadManySolutionEntity()];
      totalCount = faker.datatype.number();

      mockPrismaService.lessonSolution.findMany.mockResolvedValue(
        readManySolution,
      );
      mockPrismaService.lessonSolution.count.mockResolvedValue(totalCount);
      mockPrismaService.$transaction.mockResolvedValue([
        readManySolution,
        totalCount,
      ]);
    });

    it('SUCCESS - check call', async () => {
      const { page, pageSize, orderBy, sortBy, ...filter } = query;
      const settledOrderBy = SOLUTION_VIRTUAL_COLUMN_FOR_READ_MANY[sortBy]
        ? { _count: orderBy }
        : orderBy;

      expect(solutionService.readManySolution(query)).resolves;
      expect(queryHelper.buildOrderByPropForFind).toBeCalledTimes(1);
      expect(queryHelper.buildWherePropForFind).toBeCalledWith(filter);
      expect(queryHelper.buildOrderByPropForFind).toBeCalledTimes(1);
      expect(queryHelper.buildOrderByPropForFind).toBeCalledWith({
        [sortBy]: settledOrderBy,
      });
      expect(prismaService.lessonSolution.findMany).toBeCalledTimes(1);
      expect(prismaService.lessonSolution.count).toBeCalledTimes(1);
    });

    it('SUCCESS - sortBy is virtualColumn', async () => {
      query.sortBy = SolutionVirtualColumn.LessonSolutionComments;

      expect(solutionService.readManySolution(query)).resolves;
      expect(queryHelper.buildOrderByPropForFind).toBeCalledWith({
        [query.sortBy]: { _count: query.orderBy },
      });
    });

    it('SUCCESS - sortBy is not virtualColumn', async () => {
      query.sortBy = EntityId.Id;

      expect(solutionService.readManySolution(query)).resolves;
      expect(queryHelper.buildOrderByPropForFind).toBeCalledWith({
        [query.sortBy]: query.orderBy,
      });
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
