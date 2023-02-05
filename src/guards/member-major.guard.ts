import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MajorId } from '@src/constants/enum';
import { MEMBER_JOBS } from '@src/modules/member/constants/member.const';
import { MemberEntity } from '@src/modules/member/entities/member.entity';
import { MemberMajors } from '@src/modules/member/types/member.type';

/**
 * member 의 major 에 따라 막는 가드
 *
 * 이 가드를 사용하려면 JwtAuthGuard 가 붙어있어야합니다.
 *
 * MemberMajorSetMetadataGuard 데코레이터를 통해 사용해야합니다.
 */
@Injectable()
export class MemberMajorGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowMemberMajors: MemberMajors = this.reflector.get(
      MEMBER_JOBS,
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();
    const member: MemberEntity = request.user;
    const majorId = member.majorId || undefined;

    if (allowMemberMajors.length === 0) {
      if (majorId !== undefined) {
        throw new ForbiddenException('major 미선택 유저만 접근 가능합니다.');
      }

      return true;
    }

    const allowMemberMajorsStr = allowMemberMajors
      .map((major) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return MajorId[major];
      })
      .join(', ');

    if (!allowMemberMajors.includes(majorId)) {
      throw new ForbiddenException(
        allowMemberMajorsStr + ' ' + 'major 유저만 접근 가능합니다.',
      );
    }

    return true;
  }
}
