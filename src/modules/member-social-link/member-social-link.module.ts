import { Module } from '@nestjs/common';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MemberSocialLinkController } from './controllers/member-social-link.controller';
import { MemberSocialLinkService } from './services/member-social-link.service';

@Module({
  controllers: [MemberSocialLinkController],
  providers: [MemberSocialLinkService, PrismaService],
})
export class MemberSocialLinkModule {}
