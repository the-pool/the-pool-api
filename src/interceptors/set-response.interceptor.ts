import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { Reflector } from '@nestjs/core';
import { RESPONSE_FIELD_NAME } from '@src/constants/constant';
import { map, Observable } from 'rxjs';

/**
 * 클라이언트에게 response 전 특정 key 를 가진 객체로 response 해주는 interceptor
 *
 * SetResponseSetMetadataInterceptor 데코레이터를 통해 사용해야합니다.
 */
@Injectable()
export class SetResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const key = this.reflector.get<string>(
      RESPONSE_FIELD_NAME,
      context.getHandler(),
    );

    return next.handle().pipe(
      map((value) => {
        if (isNil(key)) {
          return value;
        }

        return { [key]: value };
      }),
    );
  }
}
