import { Test, TestingModule } from '@nestjs/testing';
import { MemberSocialLinkService } from './member-social-link.service';

describe('MemberSocialLinkService', () => {
  let service: MemberSocialLinkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemberSocialLinkService],
    }).compile();

    service = module.get<MemberSocialLinkService>(MemberSocialLinkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
