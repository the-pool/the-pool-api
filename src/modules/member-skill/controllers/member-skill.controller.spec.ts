import { Test, TestingModule } from '@nestjs/testing';
import { FindMemberSkillListQueryDto } from '@src/modules/member-skill/dtos/find-member-skill-list-query.dto';
import { MemberSkillEntity } from '@src/modules/member-skill/entities/member-skill.entity';
import { MemberSkillService } from '@src/modules/member-skill/services/member-skill.service';
import { mockMemberSkillService } from '../../../../test/mock/mock-services';
import { MemberSkillController } from './member-skill.controller';

describe('MemberSkillController', () => {
  let controller: MemberSkillController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberSkillController],
      providers: [
        {
          provide: MemberSkillService,
          useValue: mockMemberSkillService,
        },
      ],
    }).compile();

    controller = module.get<MemberSkillController>(MemberSkillController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    let memberSkills: MemberSkillEntity;
    let query: FindMemberSkillListQueryDto;

    beforeEach(() => {
      memberSkills = new MemberSkillEntity();
      query = new FindMemberSkillListQueryDto();
    });

    it('조회 성공', () => {
      mockMemberSkillService.findAll.mockReturnValue(memberSkills);

      const result = controller.findAll(query);

      expect(mockMemberSkillService.findAll).toBeCalledWith(query.memberId);
      expect(result).toStrictEqual(memberSkills);
    });
  });
});
