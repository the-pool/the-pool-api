import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { HttpExceptionHelper } from '@src/filters/http-exception.helper';
import { ResponseJson } from '@src/filters/type';

/**
 * 예상하지 못한 에러 발생 시 nodeJS 레벨에서 발생하는 에러
 * ex) throw new Error()
 */
@Catch()
export class HttpNodeInternalServerErrorExceptionFilter
  extends HttpExceptionHelper
  implements ExceptionFilter
{
  constructor(private readonly isProduction: boolean) {
    super();
  }

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    const responseJson: ResponseJson = this.buildResponseJson(status);

    responseJson.errors = [
      this.preProcessByServerError(
        this.isProduction ? undefined : exception.stack,
      ),
    ];
    console.log(responseJson);
    response.status(status).json(responseJson);
  }
}
