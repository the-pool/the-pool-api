import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PrismaModel } from '@src/types/type';

export const SetModelNameToParam = createParamDecorator(
  (data: PrismaModel, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    request.params.model = data;
  },
);
