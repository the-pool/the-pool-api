import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PrismaModelName } from '@src/types/type';

export const SetModelNameToParam = createParamDecorator(
  (data: PrismaModelName, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    request.params.model = data;
  },
);
