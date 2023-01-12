import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { incrementMemberReport } from '@src/decorators/increment-member-report.decorator';
import { setResponse } from '@src/decorators/set-response.decorator';
import { FindMemberReportListQueryDto } from '@src/modules/member-report/dtos/find-member-report-list-query.dto';
import { MemberReportEntity } from '@src/modules/member-report/entities/member-report.entity';
import { MemberReportService } from '@src/modules/member-report/services/member-report.service';
import { InternalServerErrorResponseType } from '@src/types/internal-server-error-response.type';
import { NotFoundResponseType } from '@src/types/not-found-response.type';
import { FindMemberReportRequestParamDto } from '../dtos/find-member-report-request-param.dto';

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

  @ApiOperation({ summary: 'member report 단일 조회' })
  @ApiOkResponse({
    schema: {
      properties: {
        memberReport: {
          $ref: getSchemaPath(MemberReportEntity),
        },
      },
    },
  })
  @incrementMemberReport('commentCount')
  @setResponse('memberReport')
  @Get(':memberId')
  findOne(@Param() params: FindMemberReportRequestParamDto) {
    return this.memberReportService.findOne({ memberId: params.memberId });
  }
}
