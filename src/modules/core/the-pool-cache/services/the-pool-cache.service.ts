import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MemberSocialLinkEntity } from '@src/modules/member-social-link/entities/member-social-link.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class ThePoolCacheService {
  private readonly MEMBER_SOCIAL_LINKS = 'memberSocialLinks';

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly prismaService: PrismaService,
  ) {}

  async getMemberSocialLinks() {
    const memberSocialLinks = await this.cacheManager.get<
      MemberSocialLinkEntity[]
    >(this.MEMBER_SOCIAL_LINKS);

    if (memberSocialLinks) {
      return memberSocialLinks;
    }
    return this.setMemberSocialLinks();
  }

  async setMemberSocialLinks(ttl: number = 60 * 60) {
    const memberSocialLinks =
      await this.prismaService.memberSocialLink.findMany();

    return this.cacheManager.set(this.MEMBER_SOCIAL_LINKS, memberSocialLinks, {
      ttl,
    });
  }
}
