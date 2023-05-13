import { Test, TestingModule } from '@nestjs/testing';
import { MemberInterestController } from '@src/modules/member-interest/controllers/member-interest.controller';
import { FindMemberInterestListQueryDto } from '@src/modules/member-interest/dtos/find-member-interest-list-query.dto';
import { MemberInterestEntity } from '@src/modules/member-interest/entities/member-interest.entity';
import { MemberInterestService } from '@src/modules/member-interest/services/member-interest.service';
import { mockMemberInterestService } from '@test/mock/mock-services';

describe('MemberInterestController', () => {
  let controller: MemberInterestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberInterestController],
      providers: [
        {
          provide: MemberInterestService,
          useValue: mockMemberInterestService,
        },
      ],
    }).compile();

    controller = module.get<MemberInterestController>(MemberInterestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    let memberInterests: MemberInterestEntity;
    let query: FindMemberInterestListQueryDto;

    beforeEach(() => {
      memberInterests = new MemberInterestEntity();
      query = new FindMemberInterestListQueryDto();
    });

    it('조회 성공', () => {
      mockMemberInterestService.findAll.mockReturnValue(memberInterests);

      const result = controller.findAll(query);

      expect(mockMemberInterestService.findAll).toBeCalledWith(query.memberId);
      expect(result).toStrictEqual(memberInterests);
    });
  });
});
