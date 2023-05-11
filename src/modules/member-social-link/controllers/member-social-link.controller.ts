import { Controller, Get } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SetResponseSetMetadataInterceptor } from '@src/decorators/set-response-set-metadata.interceptor-decorator';
import { ApiFindAll } from '@src/modules/member-social-link/controllers/member-social-link.swagger';
import { MemberSocialLinkEntity } from '@src/modules/member-social-link/entities/member-social-link.entity';
import { MemberSocialLinkService } from '@src/modules/member-social-link/services/member-social-link.service';
import { InternalServerErrorResponseType } from '@src/types/internal-server-error-response.type';
import { NotFoundResponseType } from '@src/types/not-found-response.type';

@ApiTags('멤버 social link')
@ApiNotFoundResponse({ type: NotFoundResponseType })
@ApiInternalServerErrorResponse({ type: InternalServerErrorResponseType })
@Controller('api/member-social-links')
export class MemberSocialLinkController {
  constructor(
    private readonly memberSocialLinkService: MemberSocialLinkService,
  ) {}

  @ApiFindAll('member social link 리스트 조회')
  @SetResponseSetMetadataInterceptor('memberSocialLinks')
  @Get()
  findAll(): Promise<MemberSocialLinkEntity[]> {
    return this.memberSocialLinkService.findAll();
  }
}
