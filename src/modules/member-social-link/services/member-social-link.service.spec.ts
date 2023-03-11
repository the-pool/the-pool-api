import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MemberSocialLinkEntity } from '@src/modules/member-social-link/entities/member-social-link.entity';
import { mockPrismaService } from '../../../../test/mock/mock-prisma-service';
import { mockConfigService } from '../../../../test/mock/mock-services';
import { MemberSocialLinkService } from './member-social-link.service';

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
          provide: ConfigService,
          useValue: mockConfigService,
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
    const CF_RUL = 'cfURL';

    beforeEach(() => {
      memberSocialLinkEntities = [new MemberSocialLinkEntity()];
      memberSocialLinkEntities[0].iconPath = 'path';

      mockPrismaService.memberSocialLink.findMany.mockRestore();
      mockConfigService.get.mockReturnValue(CF_RUL);
    });

    it('findAll', async () => {
      mockPrismaService.memberSocialLink.findMany.mockResolvedValue(
        memberSocialLinkEntities,
      );

      await expect(service.findAll()).resolves.toStrictEqual([
        {
          ...memberSocialLinkEntities[0],
          iconUrl: CF_RUL + '/' + memberSocialLinkEntities[0].iconPath,
        },
      ]);
    });
  });
});
