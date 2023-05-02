import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { ENV_KEY } from '@src/modules/core/the-pool-config/constants/the-pool-config.constant';
import { ThePoolConfigService } from '@src/modules/core/the-pool-config/services/the-pool-config.service';
import { MemberSocialLinkEntity } from '@src/modules/member-social-link/entities/member-social-link.entity';

@Injectable()
export class MemberSocialLinkService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly thePoolConfigService: ThePoolConfigService,
  ) {}

  /**
   * member social link 전체 조회
   */
  async findAll(): Promise<MemberSocialLinkEntity[]> {
    const memberSocialLinks =
      await this.prismaService.memberSocialLink.findMany();

    return memberSocialLinks.map((memberSocialLink) => {
      return {
        ...memberSocialLink,
        iconUrl: this.setIconUrl(memberSocialLink.iconPath),
      };
    });
  }

  /**
   * icon 을 조회할 수 있는 url 을 만드는 private 메서드
   */
  private setIconUrl(iconPath: string): string {
    return (
      this.thePoolConfigService.get<string>(ENV_KEY.AWS_CLOUD_FRONT_URL) +
      '/' +
      iconPath
    );
  }
}
