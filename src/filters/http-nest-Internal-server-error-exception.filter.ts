import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { HttpExceptionHelper } from '@src/filters/http-exception.helper';
import { ResponseJson } from '@src/filters/type';

/**
 * nestJS 메서드를 이용한 500번 에러 를 잡는 exception filter
 * ex) throw new InternalServerErrorException()
 */
@Catch(InternalServerErrorException)
export class HttpNestInternalServerErrorExceptionFilter
  extends HttpExceptionHelper
  implements ExceptionFilter<InternalServerErrorException>
{
  constructor(private readonly isProduction: boolean) {
    super();
  }

  catch(exception: InternalServerErrorException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const responseJson: ResponseJson = this.buildResponseJson(status);

    responseJson.errors = [
      this.preProcessByServerError(
        this.isProduction ? undefined : exception.stack,
      ),
    ];

    response.status(status).json(responseJson);
  }
}
