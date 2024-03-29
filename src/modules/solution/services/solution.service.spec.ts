import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { EntityId } from '@src/constants/enum';
import { QueryHelper } from '@src/helpers/query.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MemberStatisticsEvent } from '@src/modules/member-statistics/events/member-statistics.event';
import { SOLUTION_VIRTUAL_COLUMN_FOR_READ_MANY } from '@src/modules/solution/constants/solution.const';
import { SolutionVirtualColumn } from '@src/modules/solution/constants/solution.enum';
import { CreateSolutionRequestBodyDto } from '@src/modules/solution/dtos/create-solution-request-body.dto';
import { LessonSolutionStatisticsResponseBodyDto } from '@src/modules/solution/dtos/lesson-solution-statistics-response-body.dto';
import { ReadManySolutionRequestQueryDto } from '@src/modules/solution/dtos/read-many-solution-request-query.dto';
import { UpdateSolutionRequestBodyDto } from '@src/modules/solution/dtos/update-solution-request-body.dto';
import { ReadManySolutionEntity } from '@src/modules/solution/entities/read-many-solution.entity';
import { ReadOneSolutionEntity } from '@src/modules/solution/entities/read-one-solution.entity';
import { SolutionLikeEntity } from '@src/modules/solution/entities/solution-like.entity';
import { SolutionEntity } from '@src/modules/solution/entities/solution.entity';
import { LessonSolutionRepository } from '@src/modules/solution/repositories/lesson-solution.repository';
import { SolutionService } from '@src/modules/solution/services/solution.service';
import { mockMemberStatisticsEvent } from '@test/mock/mock-event';
import { mockQueryHelper } from '@test/mock/mock-helpers';
import { mockPrismaService } from '@test/mock/mock-prisma-service';
import { mockLessonSolutionRepository } from '@test/mock/mock-repositories';

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
        {
          provide: MemberStatisticsEvent,
          useValue: mockMemberStatisticsEvent,
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
      await expect(
        solutionService.createSolution(createSolutionDto, memberId),
      ).resolves.toStrictEqual(createdSolution);

      expect(prismaService.lessonSolution.create).toBeCalledTimes(1);
      expect(mockMemberStatisticsEvent.register).toBeCalledWith(memberId, {
        fieldName: 'solutionCount',
        action: 'increment',
      });
    });
  });

  /// UPDATE Solution
  describe('UPDATE Solution', () => {
    let solutionId: number;
    let updateRequestDto: UpdateSolutionRequestBodyDto;
    let updatedSolution: SolutionEntity;

    beforeEach(() => {
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
    let memberId: number;
    let deletedSolution: SolutionEntity;

    beforeEach(() => {
      solutionId = faker.datatype.number();
      memberId = faker.datatype.number();
      deletedSolution = new SolutionEntity();

      prismaService.lessonSolution.delete.mockResolvedValue(deletedSolution);
    });

    it('SUCCESS - Soultion Delete', () => {
      expect(
        solutionService.deleteSolution(solutionId, memberId),
      ).resolves.toStrictEqual(deletedSolution);
      expect(prismaService.lessonSolution.delete).toBeCalledTimes(1);
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
    let memberId: number | null;
    let readManySolution: ReadManySolutionEntity[];
    let totalCount: number;

    beforeEach(() => {
      query = new ReadManySolutionRequestQueryDto();
      memberId = null;
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
      const { page, pageSize, orderBy, sortBy, likedMemberId, ...filter } =
        query;
      const settledOrderBy = SOLUTION_VIRTUAL_COLUMN_FOR_READ_MANY[sortBy]
        ? { _count: orderBy }
        : orderBy;

      await expect(solutionService.readManySolution(query)).resolves;
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

      await expect(solutionService.readManySolution(query)).resolves;
      expect(queryHelper.buildOrderByPropForFind).toBeCalledWith({
        [query.sortBy]: { _count: query.orderBy },
      });
    });

    it('SUCCESS - sortBy is not virtualColumn', async () => {
      query.sortBy = EntityId.Id;

      await expect(solutionService.readManySolution(query)).resolves;
      expect(queryHelper.buildOrderByPropForFind).toBeCalledWith({
        [query.sortBy]: query.orderBy,
      });
    });

    it('SUCCESS - likedMemberId filtering', async () => {
      memberId = 1;
      query.likedMemberId = memberId;

      await expect(
        solutionService.readManySolution(query),
      ).resolves.toBeDefined();

      expect(mockPrismaService.lessonSolution.findMany).toBeCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            lessonSolutionLikes: {
              some: {
                memberId,
              },
            },
          }),
          skip: expect.anything(),
          take: expect.anything(),
          include: expect.anything(),
        }),
      );
      expect(mockPrismaService.lessonSolution.count).toBeCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            lessonSolutionLikes: {
              some: {
                memberId,
              },
            },
          }),
        }),
      );
    });
  });

  describe('Solution Like Create', () => {
    let memberId: number;
    let solutionId: number;
    let likeEntity: SolutionLikeEntity;

    beforeEach(() => {
      memberId = faker.datatype.number();
      solutionId = faker.datatype.number();
      likeEntity = new SolutionLikeEntity();

      prismaService.lessonSolutionLike.create.mockResolvedValue(likeEntity);
    });

    it('SUCCESS - 좋아요 성공', () => {
      expect(
        solutionService.createLike(solutionId, memberId),
      ).resolves.toStrictEqual(likeEntity);
      expect(prismaService.lessonSolutionLike.create).toBeCalledTimes(1);
    });
  });

  describe('Solution Like Delete', () => {
    let memberId: number;
    let solutionId: number;
    let likeEntity: SolutionLikeEntity;

    beforeEach(() => {
      memberId = faker.datatype.number();
      solutionId = faker.datatype.number();
      likeEntity = new SolutionLikeEntity();

      prismaService.lessonSolutionLike.delete.mockResolvedValue(likeEntity);
    });

    it('SUCCESS - 좋아요 취소', () => {
      expect(
        solutionService.deleteLike(solutionId, memberId),
      ).resolves.toStrictEqual(likeEntity);
      expect(prismaService.lessonSolutionLike.delete).toBeCalledTimes(1);
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
