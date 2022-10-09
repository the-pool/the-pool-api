import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const SetModelNameToParam = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    request.params.model = data;
  },
);
