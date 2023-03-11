import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiSuccessResponse } from '@src/decorators/api-success-response.decorator';
import { MemberSocialLinkEntity } from '@src/modules/member-social-link/entities/member-social-link.entity';

export const ApiFindAll = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiSuccessResponse(HttpStatus.OK, {
      memberSocialLinks: {
        type: MemberSocialLinkEntity,
        isArray: true,
      },
    }),
  );
};
