import { Test, TestingModule } from '@nestjs/testing';
import { MemberSocialLinkController } from '@src/modules/member-social-link/controllers/member-social-link.controller';
import { MemberSocialLinkEntity } from '@src/modules/member-social-link/entities/member-social-link.entity';
import { MemberSocialLinkService } from '@src/modules/member-social-link/services/member-social-link.service';
import { mockMemberSocialLinkService } from '@test/mock/mock-services';

describe('MemberSocialLinkController', () => {
  let controller: MemberSocialLinkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberSocialLinkController],
      providers: [
        {
          provide: MemberSocialLinkService,
          useValue: mockMemberSocialLinkService,
        },
      ],
    }).compile();

    controller = module.get<MemberSocialLinkController>(
      MemberSocialLinkController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    let memberSocialLinkEntities: MemberSocialLinkEntity[];

    beforeEach(() => {
      memberSocialLinkEntities = [new MemberSocialLinkEntity()];

      mockMemberSocialLinkService.findAll.mockRestore();
    });

    it('성공', () => {
      mockMemberSocialLinkService.findAll.mockResolvedValue(
        memberSocialLinkEntities,
      );

      expect(controller.findAll()).resolves.toStrictEqual(
        memberSocialLinkEntities,
      );
    });
  });
});
