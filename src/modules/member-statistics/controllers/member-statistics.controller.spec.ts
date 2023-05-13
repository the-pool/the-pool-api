import { Test, TestingModule } from '@nestjs/testing';
import { MemberStatisticsController } from '@src/modules/member-statistics/controllers/member-statistics.controller';
import { FindMemberStatisticsListQueryDto } from '@src/modules/member-statistics/dtos/find-member-statistics-list-query.dto';
import { FindMemberStatisticsRequestParamDto } from '@src/modules/member-statistics/dtos/find-member-statistics-request-param.dto';
import { MemberStatisticsEntity } from '@src/modules/member-statistics/entities/member-statistics.entity';
import { MemberStatisticsService } from '@src/modules/member-statistics/services/member-statistics.service';
import { mockMemberStatisticsService } from '@test/mock/mock-services';

describe('MemberMemberStatisticsController', () => {
  let controller: MemberStatisticsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberStatisticsController],
      providers: [
        {
          provide: MemberStatisticsService,
          useValue: mockMemberStatisticsService,
        },
      ],
    }).compile();

    controller = module.get<MemberStatisticsController>(
      MemberStatisticsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    let memberMemberStatistics: MemberStatisticsEntity[];
    let query: FindMemberStatisticsListQueryDto;

    beforeEach(() => {
      memberMemberStatistics = [new MemberStatisticsEntity()];
      query = new FindMemberStatisticsListQueryDto();
    });

    it('조회 성공', () => {
      mockMemberStatisticsService.findAll.mockReturnValue(
        memberMemberStatistics,
      );

      const result = controller.findAll(query);

      expect(mockMemberStatisticsService.findAll).toBeCalledWith(query);
      expect(result).toStrictEqual(memberMemberStatistics);
    });
  });

  describe('findOne', () => {
    let memberMemberStatistics: MemberStatisticsEntity;
    let params: FindMemberStatisticsRequestParamDto;

    beforeEach(() => {
      memberMemberStatistics = new MemberStatisticsEntity();
      params = new FindMemberStatisticsRequestParamDto();
    });

    it('조회 성공', () => {
      mockMemberStatisticsService.findOne.mockReturnValue(
        memberMemberStatistics,
      );

      const result = controller.findOne(params);

      expect(mockMemberStatisticsService.findOne).toBeCalledWith({
        memberId: params.memberId,
      });
      expect(result).toStrictEqual(memberMemberStatistics);
    });
  });
});
