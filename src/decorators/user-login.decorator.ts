import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserLogin = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    console.log(req.user);

    return req.user[data] || req.user;
  },
);
