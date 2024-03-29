import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MEMBER_STATUSES } from '@src/modules/member/constants/member.const';
import { MemberStatus } from '@src/modules/member/constants/member.enum';
import { MemberEntity } from '@src/modules/member/entities/member.entity';
import { MemberStatuses } from '@src/modules/member/types/member.type';

/**
 * 특정 status 를 가진 member 만 access 가능하게 하는 guard
 *
 * 이 가드를 사용하려면 JwtAuthGuard 가 붙어있어야합니다.
 *
 * AllowMemberStatusesSetMetadataGuard 데코레이터를 통해 사용해야합니다.
 */
@Injectable()
export class MemberStatusGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const member: MemberEntity = request.user;
    const allowMemberStatuses: MemberStatuses =
      this.reflector.get<MemberStatuses>(MEMBER_STATUSES, context.getHandler());
    const allowMemberStatusesStr = allowMemberStatuses
      .map((status) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return MemberStatus[status];
      })
      .join(', ');

    if (!allowMemberStatuses.includes(member.status)) {
      throw new ForbiddenException(
        allowMemberStatusesStr + ' ' + '상태의 유저만 접근 가능합니다.',
      );
    }

    return true;
  }
}
