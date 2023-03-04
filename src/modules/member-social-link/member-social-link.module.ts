import { Module } from '@nestjs/common';
import { MemberSocialLinkController } from './controllers/member-social-link.controller';
import { MemberSocialLinkService } from './services/member-social-link.service';

@Module({
  controllers: [MemberSocialLinkController],
  providers: [MemberSocialLinkService],
})
export class MemberSocialLinkModule {}
