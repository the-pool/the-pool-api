import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { QueryHelper } from '@src/helpers/query.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { FindMemberReportListQueryDto } from '@src/modules/member-report/dtos/find-member-report-list-query.dto';
import { MemberReportEntity } from '@src/modules/member-report/entities/member-report.entity';
import { mockQueryHelper } from '../../../../test/mock/mock-helpers';
import { mockPrismaService } from '../../../../test/mock/mock-prisma-service';
import { MemberReportService } from './member-report.service';

describe('MemberReportService', () => {
  let service: MemberReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberReportService,
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
    service = module.get<MemberReportService>(MemberReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneReport', () => {
    let memberReports: MemberReportEntity[];
    let totalCount: number;
    let query: FindMemberReportListQueryDto;

    beforeEach(() => {
      memberReports = [new MemberReportEntity()];
      totalCount = faker.datatype.number();
      query = new FindMemberReportListQueryDto();
    });

    it('member report 조회 성공', async () => {
      mockPrismaService.memberReport.findMany.mockResolvedValue(
        memberReports as any,
      );
      mockPrismaService.memberReport.count.mockResolvedValue(totalCount as any);
      mockPrismaService.$transaction.mockResolvedValue([
        memberReports,
        totalCount,
      ] as any);

      const result = await service.findAll(query);

      expect(mockPrismaService.memberReport.findMany).toBeCalledWith({
        where: null,
        orderBy: null,
        skip: expect.anything(),
        take: expect.anything(),
        include: {
          member: true,
        },
      });
      expect(mockPrismaService.memberReport.count).toBeCalledWith({
        where: null,
        orderBy: null,
      });
      expect(mockPrismaService.$transaction).toBeCalledWith([
        Promise.resolve(memberReports),
        Promise.resolve(totalCount),
      ]);
      expect(result).toStrictEqual({
        memberReports,
        totalCount,
      });
    });
  });
});
