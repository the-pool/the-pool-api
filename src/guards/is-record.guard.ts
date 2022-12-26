import {
  BadRequestException,
  CallHandler,
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { DOMAIN_TO_MODEL_NAME } from '@src/constants/constant';
import { ModelName } from '@src/constants/enum';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

/**
 * domain에 해당하는 리소스의 존재 유무 확인후 없으면 404에러를 뱉음
 */
@Injectable()
export class IsRecordGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { id } = request.params;
    const { path } = request.route;

    const [empty, api, domain] = path.split('/');

    await validateOrReject(
      plainToInstance(IdRequestParamDto, {
        id,
        model: DOMAIN_TO_MODEL_NAME[domain],
      }),
    ).catch((err) => {
      const { constraints } = err[0];

      throw new NotFoundException(constraints.IsRecordConstraint);
    });
    return true;
  }
}
