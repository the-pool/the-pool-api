import { Controller, Get } from '@nestjs/common';
import { MemberSocialLinkEntity } from '@src/modules/member-social-link/entities/member-social-link.entity';
import { MemberSocialLinkService } from '../services/member-social-link.service';

@Controller('member-social-links')
export class MemberSocialLinkController {
  constructor(
    private readonly memberSocialLinkService: MemberSocialLinkService,
  ) {}

  @Get()
  findAll(): Promise<MemberSocialLinkEntity[]> {
    return this.memberSocialLinkService.findAll();
  }
}
