import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpExceptionHelper } from '@src/filters/http-exception.helper';
import { ResponseJson } from '@src/filters/type';
import { NotificationService } from '@src/modules/core/notification/services/notification.service';
import { Response } from 'express';

/**
 * nestJS 메서드를 이용한 500번 에러 를 잡는 exception filter
 * ex) throw new InternalServerErrorException()
 */
@Catch(InternalServerErrorException)
export class HttpNestInternalServerErrorExceptionFilter
  extends HttpExceptionHelper
  implements ExceptionFilter<InternalServerErrorException>
{
  constructor(
    private readonly notificationService: NotificationService,
    private readonly isProduction: boolean,
  ) {
    super();
  }

  async catch(
    exception: InternalServerErrorException,
    host: ArgumentsHost,
  ): Promise<void> {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const responseJson: ResponseJson = this.buildResponseJson(status);

    responseJson.errors = [
      this.preProcessByServerError(
        this.isProduction ? undefined : exception.stack,
      ),
    ];

    try {
      await this.notificationService.serverException({
        name: 'Http Nest Internal Server Error Exception',
        method: request.method,
        path: request.url,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        body: request.body,
        stack: exception.stack,
      });
    } catch (e) {
      console.error(e);
    }

    response.status(status).json(responseJson);
  }
}
