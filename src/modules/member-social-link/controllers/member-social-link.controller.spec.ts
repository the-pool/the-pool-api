import { Test, TestingModule } from '@nestjs/testing';
import { MemberSocialLinkEntity } from '@src/modules/member-social-link/entities/member-social-link.entity';
import { mockMemberSocialLinkService } from '../../../../test/mock/mock-services';
import { MemberSocialLinkService } from '../services/member-social-link.service';
import { MemberSocialLinkController } from './member-social-link.controller';

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
