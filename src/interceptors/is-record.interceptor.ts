import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { DOMAIN_TO_MODEL_NAME } from '@src/constants/constant';
import { ModelName } from '@src/constants/enum';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { plainToInstance } from 'class-transformer';
import { validate, validateOrReject } from 'class-validator';
import { map, Observable } from 'rxjs';

@Injectable()
export class IsRecordInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
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

      throw new BadRequestException(constraints.IsRecordConstraint);
    });

    return next.handle().pipe(map((data) => data));
  }
}
