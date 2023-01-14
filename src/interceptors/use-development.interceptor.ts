import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class UseDevelopmentInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';
    const requestPath = context.switchToHttp().getRequest().path;
    const requestMethod = context.switchToHttp().getRequest().method;

    if (isProduction) {
      throw new NotFoundException(
        'Cannot' + ' ' + requestMethod + ' ' + requestPath,
      );
    }

    return next.handle();
  }
}
