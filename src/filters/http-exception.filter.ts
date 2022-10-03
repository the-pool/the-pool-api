import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface Errors {
  error: string;
  statusCode: number;
  message?: string[];
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status: number;
    let messages: any;

    if (exception instanceof HttpException) {
      const errors = exception.getResponse() as Errors;

      status = errors.statusCode;
      if (Array.isArray(errors.message)) {
        messages = errors.message;
      } else {
        messages = errors.error ? [errors.error] : [errors.message];
      }
    } else {
      status = 500;
      messages = ['서버 에러'];
    }

    if (status >= 500) {
      console.error(exception.stack);
    }

    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      messages,
    });
  }
}
