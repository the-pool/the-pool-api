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
import { NotificationService } from '@src/modules/core/notification/services/notification.service';
import { IncreaseAction } from '@src/types/type';
import { map, Observable, tap } from 'rxjs';

@Injectable()
export class IncreaseMemberFollowInterceptor implements NestInterceptor {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly prismaService: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(async () => {
        const request = context.switchToHttp().getRequest();
        // follow 또는 unfollow 하는 유저의 ID 를 가져온다.
        const toMemberId: number = request.user.id;
        // follow 또는 unfollow 당하는 유저의 ID 를 가져온다.
        const fromMemberId = Number(
          request.params[
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
          .catch(async (e) => {
            await this.notificationService.warning({
              description:
                'IncreaseMemberFollowInterceptor memberStatistics update 중 에러',
              method: request.method,
              path: request.path,
              body: request.body,
              stack: e.stack,
            });
          });
      }),
      map((data) => data),
    );
  }
}
