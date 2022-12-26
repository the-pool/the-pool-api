import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { DOMAIN_TO_MODEL_NAME } from '@src/constants/constant';
import { PrismaHelper } from '@src/modules/core/database/prisma/prisma.helper';

/**
 *  domain에 해당하는 리소스의 주인이 토큰을 디코딩했을 때 유저의 id와 같은지 확인
 */
@Injectable()
export class IsHostGuard implements CanActivate {
  constructor(private readonly prismaHelper: PrismaHelper) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { id } = request.params;
    const { id: memberId } = request.user;
    const { path } = request.route;
    const [empty, api, domain] = path.split('/');

    await this.prismaHelper.findOneOrFail(DOMAIN_TO_MODEL_NAME[domain], {
      id: parseInt(id),
      memberId,
    });
    return true;
  }
}
