import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiSuccessResponse } from '@src/decorators/api-success-response.decorator';
import { MemberSkillEntity } from '@src/modules/member-skill/entities/member-skill.entity';

export const FindAll = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiSuccessResponse(HttpStatus.OK, {
      memberSkills: {
        type: MemberSkillEntity,
        isArray: true,
      },
    }),
  );
};
