import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { NotFoundError } from '@prisma/client/runtime';
import { HttpExceptionHelper } from '@src/filters/http-exception.helper';
import { ResponseJson } from '@src/filters/type';
import { Response } from 'express';

/**
 * prisma에서 뱉어내는 not found error 객체를 위한 필터 (NotFoundException과 다름에 주의)
 */
@Catch(NotFoundError)
export class NotFoundErrorFilter
  extends HttpExceptionHelper
  implements ExceptionFilter
{
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.FORBIDDEN;
    const responseJson: ResponseJson = this.buildResponseJson(status);

    responseJson.errors = [this.preProcessByClientError(exception.message)];
    response.status(status).json(responseJson);
  }
}
