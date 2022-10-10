import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Response } from 'express';
import { ExceptionError, ResponseJson } from '@src/filters/type';
import { HttpExceptionHelper } from '@src/filters/http-exception.helper';

/**
 * 400 번 에러를 잡는 exception filter
 */
@Catch(BadRequestException)
export class HttpBadRequestExceptionFilter
  extends HttpExceptionHelper
  implements ExceptionFilter<BadRequestException>
{
  catch(exception: BadRequestException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const responseJson: ResponseJson = this.buildResponseJson(status);

    const err = exception.getResponse() as ExceptionError;

    if (Array.isArray(err.message)) {
      let errorMessages = err.message.map((errorMessage) => {
        return errorMessage.split('.').at(-1);
      });

      errorMessages = [...new Set(errorMessages)];

      responseJson.errors = errorMessages.map((errorMessage) => {
        return this.preProcessByClientError(errorMessage);
      });
    } else {
      responseJson.errors = [this.preProcessByClientError(err.message)];
    }

    response.status(status).json(responseJson);
  }
}
