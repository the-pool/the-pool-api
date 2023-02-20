import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UN_OWN_MEMBER_FIELD_NAME } from '@src/modules/member/constants/member.const';
import { MemberEntity } from '@src/modules/member/entities/member.entity';

/**
 * 접근하려는 정보가 남의 정보인지 확인하는 가드
 *
 * 이 가드를 사용하려면 JwtAuthGuard 가 붙어있어야합니다.
 *
 * UnOwnMemberSetMetadataGuard 데코레이터를 통해 사용해야합니다.
 */
@Injectable()
export class UnOwnMemberGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const memberIdFieldName = this.reflector.get(
      UN_OWN_MEMBER_FIELD_NAME,
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();
    const parmaMemberId = Number(request.params[memberIdFieldName]);
    const authenticMember: MemberEntity = request.user;

    if (parmaMemberId === authenticMember.id) {
      throw new ForbiddenException('본인 정보는 접근 불가능합니다.');
    }

    return true;
  }
}
