import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { ThePoolConfigService } from '@src/modules/core/the-pool-config/services/the-pool-config.service';
import { MemberSocialLinkEntity } from '@src/modules/member-social-link/entities/member-social-link.entity';
import { MemberSocialLinkService } from '@src/modules/member-social-link/services/member-social-link.service';
import { mockPrismaService } from '@test/mock/mock-prisma-service';
import { mockThePoolConfigService } from '@test/mock/mock-services';

describe('MemberSocialLinkService', () => {
  let service: MemberSocialLinkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberSocialLinkService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ThePoolConfigService,
          useValue: mockThePoolConfigService,
        },
      ],
    }).compile();

    service = module.get<MemberSocialLinkService>(MemberSocialLinkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    let memberSocialLinkEntities: MemberSocialLinkEntity[];
    const CF_URL = 'cfURL';

    beforeEach(() => {
      memberSocialLinkEntities = [new MemberSocialLinkEntity()];
      memberSocialLinkEntities[0].iconPath = 'path';

      mockPrismaService.memberSocialLink.findMany.mockRestore();
      mockThePoolConfigService.get.mockReturnValue(CF_URL);
    });

    it('findAll', async () => {
      mockPrismaService.memberSocialLink.findMany.mockResolvedValue(
        memberSocialLinkEntities,
      );

      await expect(service.findAll()).resolves.toStrictEqual([
        {
          ...memberSocialLinkEntities[0],
          iconUrl: CF_URL + '/' + memberSocialLinkEntities[0].iconPath,
        },
      ]);
    });
  });
});
