import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { HttpExceptionHelper } from '@src/filters/http-exception.helper';
import { ExceptionError, ResponseJson } from '@src/filters/type';
import { Response } from 'express';

/**
 * 다른 exception filter 가 잡지않는 exception 을 잡는 필터
 */
@Catch(HttpException)
export class HttpRemainderExceptionFilter
  extends HttpExceptionHelper
  implements ExceptionFilter<HttpException>
{
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const responseJson: ResponseJson = this.buildResponseJson(status);

    const err = exception.getResponse() as ExceptionError;

    responseJson.errors = [this.preProcessByClientError(err.message)];

    response.status(status).json(responseJson);
  }
}
