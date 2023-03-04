import { Test, TestingModule } from '@nestjs/testing';
import { MemberSocialLinkService } from '../services/member-social-link.service';
import { MemberSocialLinkController } from './member-social-link.controller';

describe('MemberSocialLinkController', () => {
  let controller: MemberSocialLinkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberSocialLinkController],
      providers: [MemberSocialLinkService],
    }).compile();

    controller = module.get<MemberSocialLinkController>(
      MemberSocialLinkController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
