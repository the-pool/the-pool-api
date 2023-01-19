import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { QueryHelper } from '@src/helpers/query.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { FindMemberStatisticsListQueryDto } from '@src/modules/member-statistics/dtos/find-member-statistics-list-query.dto';
import { MemberStatisticsEntity } from '@src/modules/member-statistics/entities/member-statistics.entity';
import { mockQueryHelper } from '../../../../test/mock/mock-helpers';
import { mockPrismaService } from '../../../../test/mock/mock-prisma-service';
import { MemberStatisticsService } from './member-statistics.service';

describe('MemberStatisticsService', () => {
  let service: MemberStatisticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberStatisticsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: QueryHelper,
          useValue: mockQueryHelper,
        },
      ],
    }).compile();

    mockQueryHelper.buildWherePropForFind.mockReturnValue(null);
    mockQueryHelper.buildOrderByPropForFind.mockReturnValue(null);
    service = module.get<MemberStatisticsService>(MemberStatisticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    let memberStatisticsList: Promise<MemberStatisticsEntity[]>;
    let totalCount: Promise<number>;
    let query: FindMemberStatisticsListQueryDto;

    beforeEach(() => {
      memberStatisticsList = new Promise(() => [new MemberStatisticsEntity()]);
      totalCount = new Promise(() => faker.datatype.number());
      query = new FindMemberStatisticsListQueryDto();
    });

    it('member Statistics list 조회 성공', async () => {
      mockPrismaService.memberStatistics.findMany.mockResolvedValue(
        memberStatisticsList as any,
      );
      mockPrismaService.memberStatistics.count.mockResolvedValue(
        totalCount as any,
      );
      mockPrismaService.$transaction.mockResolvedValue([
        memberStatisticsList,
        totalCount,
      ] as any);

      const result = await service.findAll(query);

      expect(mockPrismaService.memberStatistics.findMany).toBeCalledWith({
        where: null,
        orderBy: null,
        skip: expect.anything(),
        take: expect.anything(),
        include: {
          member: true,
        },
      });
      expect(mockPrismaService.memberStatistics.count).toBeCalledWith({
        where: null,
        orderBy: null,
      });
      expect(mockPrismaService.$transaction).toBeCalledWith([
        memberStatisticsList,
        totalCount,
      ]);
      expect(result).toStrictEqual({
        memberStatisticsList,
        totalCount,
      });
    });
  });

  describe('findOne', () => {
    let memberStatistics: MemberStatisticsEntity;
    let where: Prisma.MemberStatisticsWhereInput;

    beforeEach(() => {
      memberStatistics = new MemberStatisticsEntity();
      where = { memberId: faker.datatype.number() };
    });

    it('member Statistics 조회 성공', () => {
      mockPrismaService.memberStatistics.findFirst.mockReturnValue(
        memberStatistics as any,
      );

      const result = service.findOne(where);

      expect(mockPrismaService.memberStatistics.findFirst).toBeCalledWith({
        where,
      });
      expect(result).toStrictEqual(memberStatistics);
    });
  });
});
