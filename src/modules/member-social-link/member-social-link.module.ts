import { Module } from '@nestjs/common';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MemberSocialLinkController } from '@src/modules/member-social-link/controllers/member-social-link.controller';
import { MemberSocialLinkService } from '@src/modules/member-social-link/services/member-social-link.service';

@Module({
  controllers: [MemberSocialLinkController],
  providers: [MemberSocialLinkService, PrismaService],
})
export class MemberSocialLinkModule {}
