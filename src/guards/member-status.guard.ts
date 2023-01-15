import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MEMBER_STATUSES } from '@src/modules/member/constants/member.const';
import { MemberEntity } from '@src/modules/member/entities/member.entity';
import { MemberStatuses } from '@src/modules/member/types/member.type';
import { Observable } from 'rxjs';

@Injectable()
export class MemberStatusGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const member: MemberEntity = request.user;
    const allowMemberStatuses: MemberStatuses =
      this.reflector.get<MemberStatuses>(MEMBER_STATUSES, context.getHandler());

    if (!allowMemberStatuses.includes(member.status)) {
      throw new ForbiddenException(
        'pending 상태의 유저만 major 를 선택 가능합니다.',
      );
    }

    return true;
  }
}
