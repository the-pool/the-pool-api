import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { NotFoundError } from '@prisma/client/runtime';
import { ModelName } from '@src/constants/enum';
import { IsRecord } from '@src/decorators/is-record.decorator';
import { SetModelNameToParam } from '@src/decorators/set-model-name-to-param.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { HttpBadRequestExceptionFilter } from '@src/filters/http-bad-request-exception.filter';
import { plainToInstance } from 'class-transformer';
import { validate, validateOrReject } from 'class-validator';
import { map, Observable } from 'rxjs';

@Injectable()
export class LessonIsRecordInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    try {
      const request = context.switchToHttp().getRequest();
      const { id } = request.params;

      const a = await validate(
        plainToInstance(IdRequestParamDto, { id, model: ModelName.Lesson }),
      );
      console.log(a);

      return next.handle().pipe(map((data) => data));
    } catch (err) {
      const { constraints } = err[0];
      constraints;
      throw new BadRequestException(constraints.IsRecordConstraint);
    }
  }
}
