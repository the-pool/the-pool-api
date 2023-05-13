import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SetResponseSetMetadataInterceptor } from '@src/decorators/set-response-set-metadata.interceptor-decorator';
import {
  ApiFindAll,
  ApiFindOne,
} from '@src/modules/member-statistics/controllers/member-statistics.swagger';
import { FindMemberStatisticsListQueryDto } from '@src/modules/member-statistics/dtos/find-member-statistics-list-query.dto';
import { FindMemberStatisticsRequestParamDto } from '@src/modules/member-statistics/dtos/find-member-statistics-request-param.dto';
import { MemberStatisticsEntity } from '@src/modules/member-statistics/entities/member-statistics.entity';
import { MemberStatisticsService } from '@src/modules/member-statistics/services/member-statistics.service';
import { InternalServerErrorResponseType } from '@src/types/internal-server-error-response.type';
import { NotFoundResponseType } from '@src/types/not-found-response.type';

@ApiTags('멤버 statistics (유저)')
@ApiNotFoundResponse({ type: NotFoundResponseType })
@ApiInternalServerErrorResponse({ type: InternalServerErrorResponseType })
@Controller('api/member-statistics')
export class MemberStatisticsController {
  constructor(
    private readonly memberStatisticsService: MemberStatisticsService,
  ) {}

  @ApiFindAll('member statistics list 조회')
  @Get()
  findAll(@Query() query: FindMemberStatisticsListQueryDto): Promise<{
    memberStatisticsList: MemberStatisticsEntity[];
    totalCount: number;
  }> {
    return this.memberStatisticsService.findAll(query);
  }

  @ApiFindOne('member statistics 단일 조회')
  @SetResponseSetMetadataInterceptor('memberStatistics')
  @Get(':memberId')
  findOne(
    @Param() params: FindMemberStatisticsRequestParamDto,
  ): Promise<MemberStatisticsEntity> {
    return this.memberStatisticsService.findOne({
      memberId: params.memberId,
    }) as Promise<MemberStatisticsEntity>;
  }
}
