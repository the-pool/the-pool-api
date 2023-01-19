import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { Reflector } from '@nestjs/core';
import {
  INCREASE_ACTION,
  MEMBER_STATISTICS_INCREASE_FIELD_NAME,
} from '@src/constants/constant';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MemberStatisticsIncrementFieldName } from '@src/modules/member-statistics/types/member-statistics.type';
import { MemberEntity } from '@src/modules/member/entities/member.entity';
import { IncreaseAction } from '@src/types/type';
import { map, Observable, tap } from 'rxjs';

/**
 * member 가 count 를 올리는 행동을 했을 때 increment 시키는 인터셉터
 */
@Injectable()
export class IncreaseMemberStatisticsInterceptor implements NestInterceptor {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    // 특정 행동을 한 유저의 정보를 가져온다.
    const member: Partial<MemberEntity> = context
      .switchToHttp()
      .getRequest().user;
    // 증가시킬지 감소시킬지에 대한 정보를 가져온다.
    const action = this.reflector.get<IncreaseAction>(
      INCREASE_ACTION,
      context.getHandler(),
    );
    // 증감시킬 대상 필드명을 가져온다.
    const memberReportIncreaseFieldName =
      this.reflector.get<MemberStatisticsIncrementFieldName>(
        MEMBER_STATISTICS_INCREASE_FIELD_NAME,
        context.getHandler(),
      );

    return next.handle().pipe(
      tap(async () => {
        if (isNil(member) || !member.id) {
          return;
        }

        await this.prismaService.memberStatistics.update({
          data: {
            [memberReportIncreaseFieldName]: {
              [action]: 1,
            },
          },
          where: {
            memberId: member.id,
          },
        });
      }),
      map((data) => data),
    );
  }
}
