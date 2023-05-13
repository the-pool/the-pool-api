import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('loggerMiddleware');

  use(request: Request, response: Response, next: NextFunction) {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = new Date().getTime();

    this.logger.log(`${method} ${originalUrl} - ${userAgent} ${ip}`);

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      const endTime = new Date().getTime();

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
      );
      this.logger.log('api-run-time: ' + (endTime - startTime) + 'ms');
    });
    next();
  }
}
