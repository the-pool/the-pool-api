import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';

/**
 * 클라이언트에게 response 전 특정 key 를 가진 객체로 response 해주는 interceptor
 * @return { key: value }
 */
@Injectable()
export class SetResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const key = this.reflector.get<string>(
      'responseFieldName',
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
