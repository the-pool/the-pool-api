import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { MemberEntity } from '@src/modules/member/entities/member.entity';

export const UserLogin = createParamDecorator(
  (data: keyof MemberEntity, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    return req.user[data] || req.user;
  },
);
