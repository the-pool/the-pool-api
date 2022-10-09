import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';

export const SetDefaultPageSize = createParamDecorator(
  (pageSize: number, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (isNil(request.query.pageSize)) {
      request.query.pageSize = pageSize;
    }
  },
);
