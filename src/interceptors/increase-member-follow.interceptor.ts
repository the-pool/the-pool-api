import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  FROM_MEMBER_REQUEST_PARAM_FIELD_NAME,
  INCREASE_ACTION,
} from '@src/constants/constant';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { IncreaseAction } from '@src/types/type';
import { map, Observable, tap } from 'rxjs';

@Injectable()
export class IncreaseMemberFollowInterceptor implements NestInterceptor {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(async () => {
        // follow 또는 unfollow 하는 유저의 ID 를 가져온다.
        const toMemberId: number = context.switchToHttp().getRequest().user.id;
        // follow 또는 unfollow 당하는 유저의 ID 를 가져온다.
        const fromMemberId = Number(
          context.switchToHttp().getRequest().params[
            this.reflector.get(
              FROM_MEMBER_REQUEST_PARAM_FIELD_NAME,
              context.getHandler(),
            )
          ],
        );
        // 증가시킬지 감소시킬지에 대한 정보를 가져온다.
        const action = this.reflector.get<IncreaseAction>(
          INCREASE_ACTION,
          context.getHandler(),
        );

        // 앞단에서 모든 유효성처리가 끝났다고 가정하고 로직 수행
        await this.prismaService
          .$transaction([
            this.prismaService.memberStatistics.update({
              data: {
                followerCount: {
                  [action]: 1,
                },
              },
              where: {
                memberId: fromMemberId,
              },
            }),
            this.prismaService.memberStatistics.update({
              data: {
                followingCount: {
                  [action]: 1,
                },
              },
              where: {
                memberId: toMemberId,
              },
            }),
          ])
          .catch((e) => {
            // @todo 우선 로그만 찍게 만들고 나중에 후에 noti 보내는 로직 추가
            console.error(e);
          });
      }),
      map((data) => data),
    );
  }
}
