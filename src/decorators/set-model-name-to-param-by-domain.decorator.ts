import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DOMAIN_NAME_TO_MODEL_NAME } from '@src/constants/constant';

export const SetModelNameToParamByDomain = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { path } = request.route;
    // path가 "/api/domain" 이라면 split("/")했을 때 2번째 인덱스에 domain이 위치
    const domain = path.split('/')[2];

    request.params.model = DOMAIN_NAME_TO_MODEL_NAME[domain];
  },
);
