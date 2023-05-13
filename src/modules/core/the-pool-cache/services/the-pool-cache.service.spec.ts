import { faker } from '@faker-js/faker';
import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { ThePoolCacheService } from '@src/modules/core/the-pool-cache/services/the-pool-cache.service';
import { MemberSocialLinkEntity } from '@src/modules/member-social-link/entities/member-social-link.entity';
import { mockCacheManager } from '@test/mock/mock-managers';
import { mockPrismaService } from '@test/mock/mock-prisma-service';

describe('ThePoolCacheService', () => {
  let service: ThePoolCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThePoolCacheService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ThePoolCacheService>(ThePoolCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('member social link list set', async () => {
      await expect(service.onModuleInit()).resolves.toBeUndefined();
    });
  });

  describe('getMemberSocialLinks', () => {
    let memberSocialLinks: MemberSocialLinkEntity[];

    beforeEach(() => {
      memberSocialLinks = [new MemberSocialLinkEntity()];
    });

    it('store 에 memberSocialLinks 가 있는 경우', async () => {
      mockCacheManager.get.mockResolvedValue(memberSocialLinks);

      await expect(service.getMemberSocialLinks()).resolves.toStrictEqual(
        memberSocialLinks,
      );
      expect(mockCacheManager.set).toBeCalledTimes(0);
    });

    it('store 에 memberSocialLinks 가 없는 경우', async () => {
      mockCacheManager.get.mockResolvedValue(undefined);
      mockCacheManager.set.mockResolvedValue(memberSocialLinks);

      await expect(service.getMemberSocialLinks()).resolves.toStrictEqual(
        memberSocialLinks,
      );
      expect(mockCacheManager.set).toBeCalledTimes(1);
    });
  });

  describe('setMemberSocialLinks', () => {
    let memberSocialLinks: MemberSocialLinkEntity[];

    beforeEach(() => {
      memberSocialLinks = [new MemberSocialLinkEntity()];
    });

    it('ttl 이 들어온 경우', async () => {
      const ttl = faker.datatype.number();

      mockCacheManager.set.mockResolvedValue(memberSocialLinks);
      mockPrismaService.memberSocialLink.findMany.mockResolvedValue(
        memberSocialLinks as any,
      );

      await expect(service.setMemberSocialLinks(ttl)).resolves.toStrictEqual(
        memberSocialLinks,
      );
      expect(mockCacheManager.set).toBeCalledWith(
        expect.anything(),
        memberSocialLinks,
        { ttl },
      );
    });

    it('ttl 이 들어오지 않은 경우', async () => {
      mockCacheManager.set.mockResolvedValue(memberSocialLinks);
      mockPrismaService.memberSocialLink.findMany.mockResolvedValue(
        memberSocialLinks as any,
      );

      await expect(service.setMemberSocialLinks()).resolves.toStrictEqual(
        memberSocialLinks,
      );
      expect(mockCacheManager.set).toBeCalledWith(
        expect.anything(),
        memberSocialLinks,
        { ttl: 3600 },
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
