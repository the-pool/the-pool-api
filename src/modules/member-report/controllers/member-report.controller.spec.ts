import { Test, TestingModule } from '@nestjs/testing';
import { FindMemberReportListQueryDto } from '@src/modules/member-report/dtos/find-member-report-list-query.dto';
import { MemberReportService } from '@src/modules/member-report/services/member-report.service';
import { MemberReportEntity } from '@src/modules/member/entities/member-report.entity';
import { mockMemberReportService } from '../../../../test/mock/mock-services';
import { MemberReportController } from './member-report.controller';

describe('MemberReportController', () => {
  let controller: MemberReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberReportController],
      providers: [
        {
          provide: MemberReportService,
          useValue: mockMemberReportService,
        },
      ],
    }).compile();

    controller = module.get<MemberReportController>(MemberReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    let memberReports: MemberReportEntity[];
    let query: FindMemberReportListQueryDto;

    beforeEach(() => {
      memberReports = [new MemberReportEntity()];
      query = new FindMemberReportListQueryDto();
    });

    it('조회 성공', () => {
      mockMemberReportService.findAll.mockReturnValue(memberReports);

      const result = controller.findAll(query);

      expect(mockMemberReportService.findAll).toBeCalledWith(query);
      expect(result).toStrictEqual(memberReports);
    });
  });
});
