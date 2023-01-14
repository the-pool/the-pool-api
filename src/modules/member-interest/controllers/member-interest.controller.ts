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
import { FindMemberInterestListQueryDto } from '@src/modules/member-interest/dtos/find-member-interest-list-query.dto';
import { MemberInterestEntity } from '@src/modules/member-interest/entities/member-interest.entity';
import { MemberInterestService } from '@src/modules/member-interest/services/member-interest.service';
import { InternalServerErrorResponseType } from '@src/types/internal-server-error-response.type';
import { NotFoundResponseType } from '@src/types/not-found-response.type';

@ApiTags('멤버 관심사 (유저)')
@ApiNotFoundResponse({ type: NotFoundResponseType })
@ApiInternalServerErrorResponse({ type: InternalServerErrorResponseType })
@Controller('api/member-interests')
export class MemberInterestController {
  constructor(private readonly memberInterestService: MemberInterestService) {}

  @ApiOperation({ summary: 'member 관심사 리스트 조회' })
  @ApiExtraModels(MemberInterestEntity)
  @ApiOkResponse({
    schema: {
      properties: {
        memberInterests: {
          type: 'array',
          items: {
            $ref: getSchemaPath(MemberInterestEntity),
          },
        },
      },
    },
  })
  @SetResponse('memberInterests')
  @Get()
  findAll(
    @Query() query: FindMemberInterestListQueryDto,
  ): Promise<MemberInterestEntity[]> {
    return this.memberInterestService.findAll(query.memberId);
  }
}
