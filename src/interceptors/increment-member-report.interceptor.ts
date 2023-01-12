import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { Reflector } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { MEMBER_REPORT_INCREMENT_FIELD_NAME } from '@src/constants/constant';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MemberEntity } from '@src/modules/member/entities/member.entity';
import { map, Observable, tap } from 'rxjs';

/**
 * member 가 count 를 올리는 행동을 했을 때 increment 시키는 인터셉터
 */
@Injectable()
export class IncrementMemberReportInterceptor implements NestInterceptor {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const member: Partial<MemberEntity> = context
      .switchToHttp()
      .getRequest().user;
    const memberReportIncrementFieldName: keyof Omit<
      Prisma.MemberReportUpdateInput,
      'rank' | 'count' | 'member'
    > = this.reflector.get<
      keyof Omit<Prisma.MemberReportUpdateInput, 'rank' | 'count' | 'member'>
    >(MEMBER_REPORT_INCREMENT_FIELD_NAME, context.getHandler());

    return next.handle().pipe(
      tap(async () => {
        if (isNil(member) || !member.id) {
          return;
        }

        await this.prismaService.memberReport.update({
          data: {
            [memberReportIncrementFieldName]: {
              increment: 1,
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
