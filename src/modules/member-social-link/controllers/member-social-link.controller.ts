import { Controller } from '@nestjs/common';
import { MemberSocialLinkService } from '../services/member-social-link.service';

@Controller('member-social-link')
export class MemberSocialLinkController {
  constructor(
    private readonly memberSocialLinkService: MemberSocialLinkService,
  ) {}
}
