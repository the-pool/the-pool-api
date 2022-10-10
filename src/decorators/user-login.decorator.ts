import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserLogin = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    return req.user[data] || req.user;
  },
);
