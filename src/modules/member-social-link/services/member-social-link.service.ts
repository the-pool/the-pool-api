import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MemberSocialLinkEntity } from '@src/modules/member-social-link/entities/member-social-link.entity';
import path from 'path';

@Injectable()
export class MemberSocialLinkService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
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
    return path.join(
      this.configService.get<string>('AWS_CLOUD_FRONT_URL') as string,
      iconPath,
    );
  }
}
