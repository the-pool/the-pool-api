import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common';
import { HttpExceptionHelper } from '@src/filters/http-exception.helper';
import { ExceptionError, ResponseJson } from '@src/filters/type';
import { Response } from 'express';

/**
 * 404 번 에러를 잡는 exception filter
 */
@Catch(NotFoundException)
export class HttpNotFoundExceptionFilter
  extends HttpExceptionHelper
  implements ExceptionFilter<NotFoundException>
{
  catch(exception: NotFoundException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const responseJson: ResponseJson = this.buildResponseJson(status);

    const err = exception.getResponse() as ExceptionError;

    if (/^\bCannot (GET|POST|PATCH|PUT|DELETE)\b/.test(err.message)) {
      responseJson.errors = [this.preProcessByClientError(err.message)];
    } else {
      responseJson.errors = [this.preProcessByClientError(err.message)];
    }

    response.status(status).json(responseJson);
  }
}
