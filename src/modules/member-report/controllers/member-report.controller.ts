import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SetResponse } from '@src/decorators/set-response.decorator';
import {
  ApiFindAll,
  ApiFindOne,
} from '@src/modules/member-report/controllers/member-report.swagger';
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

  @ApiFindAll('member report list 조회')
  @Get()
  findAll(
    @Query() query: FindMemberReportListQueryDto,
  ): Promise<{ memberReports: MemberReportEntity[]; totalCount: number }> {
    return this.memberReportService.findAll(query);
  }

  @ApiFindOne('member report 단일 조회')
  @SetResponse('memberReport')
  @Get(':memberId')
  findOne(
    @Param() params: FindMemberReportRequestParamDto,
  ): Promise<MemberReportEntity> {
    return this.memberReportService.findOne({ memberId: params.memberId });
  }
}
