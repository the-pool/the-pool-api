import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { FindMemberReportListQueryDto } from '@src/modules/member-report/dtos/find-member-report-list-query.dto';
import { MemberReportEntity } from '@src/modules/member-report/entities/member-report.entity';
import { MemberReportService } from '@src/modules/member-report/services/member-report.service';
import { InternalServerErrorResponseType } from '@src/types/internal-server-error-response.type';
import { NotFoundResponseType } from '@src/types/not-found-response.type';

@ApiTags('멤버 report (유저)')
@ApiNotFoundResponse({ type: NotFoundResponseType })
@ApiInternalServerErrorResponse({ type: InternalServerErrorResponseType })
@Controller('api/member-reports')
export class MemberReportController {
  constructor(private readonly memberReportService: MemberReportService) {}

  @ApiOperation({ summary: 'member report list 조회' })
  @ApiOkResponse({
    schema: {
      properties: {
        memberReports: {
          type: 'array',
          items: {
            $ref: getSchemaPath(MemberReportEntity),
          },
        },
        totalCount: {
          type: 'number',
          example: 123,
        },
      },
    },
  })
  @Get()
  findAll(
    @Query() query: FindMemberReportListQueryDto,
  ): Promise<{ memberReports: MemberReportEntity[]; totalCount: number }> {
    return this.memberReportService.findAll(query);
  }
}
