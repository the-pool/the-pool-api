import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ModelName } from '@src/constants/enum';

export const SetModelNameToParam = createParamDecorator(
  (data: ModelName, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    request.params.model = data;
  },
);
