import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { SetResponse } from '@src/decorators/set-response.decorator';
import { FindMemberSkillListQueryDto } from '@src/modules/member-skill/dtos/find-member-skill-list-query.dto';
import { MemberSkillEntity } from '@src/modules/member-skill/entities/member-skill.entity';
import { MemberSkillService } from '@src/modules/member-skill/services/member-skill.service';
import { InternalServerErrorResponseType } from '@src/types/internal-server-error-response.type';
import { NotFoundResponseType } from '@src/types/not-found-response.type';

@ApiTags('멤버 스킬 (유저)')
@ApiNotFoundResponse({ type: NotFoundResponseType })
@ApiInternalServerErrorResponse({ type: InternalServerErrorResponseType })
@Controller('api/member-skills')
export class MemberSkillController {
  constructor(private readonly memberSkillService: MemberSkillService) {}

  @ApiOperation({ summary: 'member 의 스킬 리스트 조회' })
  @ApiExtraModels(MemberSkillEntity)
  @ApiOkResponse({
    schema: {
      properties: {
        memberSkills: {
          type: 'array',
          items: {
            $ref: getSchemaPath(MemberSkillEntity),
          },
        },
      },
    },
  })
  @SetResponse('memberSkills')
  @Get()
  findAll(
    @Query() query: FindMemberSkillListQueryDto,
  ): Promise<MemberSkillEntity[]> {
    return this.memberSkillService.findAll(query.memberId);
  }
}
