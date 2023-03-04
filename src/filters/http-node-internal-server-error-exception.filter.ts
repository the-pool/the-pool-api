import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { HttpExceptionHelper } from '@src/filters/http-exception.helper';
import { ResponseJson } from '@src/filters/type';
import { NotificationService } from '@src/modules/core/notification/services/notification.service';
import { Response } from 'express';

/**
 * 예상하지 못한 에러 발생 시 nodeJS 레벨에서 발생하는 에러
 * ex) throw new Error()
 */
@Catch()
export class HttpNodeInternalServerErrorExceptionFilter
  extends HttpExceptionHelper
  implements ExceptionFilter
{
  constructor(
    private readonly notificationService: NotificationService,
    private readonly isProduction: boolean,
  ) {
    super();
  }

  async catch(exception: any, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    const responseJson: ResponseJson = this.buildResponseJson(status);
    responseJson.errors = [
      this.preProcessByServerError(
        this.isProduction ? undefined : exception.stack,
      ),
    ];

    try {
      await this.notificationService.error({
        name: 'Http Node Internal Server Error Exception',
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
