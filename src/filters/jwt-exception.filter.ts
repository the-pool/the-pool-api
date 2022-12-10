import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { HttpExceptionHelper } from '@src/filters/http-exception.helper';
import { Response } from 'express';
import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from 'jsonwebtoken';
import { ResponseJson } from './type';

/**
 * jwt 토큰을 validate했을 때 나오는 에러를 관리하기 위한 filter
 */
@Catch(JsonWebTokenError, TokenExpiredError, NotBeforeError)
export class JwtExceptionFilter
  extends HttpExceptionHelper
  implements ExceptionFilter
{
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.UNAUTHORIZED;
    const responseJson: ResponseJson = this.buildResponseJson(status);

    responseJson.errors = [this.preProcessByClientError(exception.message)];

    response.status(status).json(responseJson);
  }
}
