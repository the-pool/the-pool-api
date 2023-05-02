import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { ThePoolConfigService } from '@src/modules/core/the-pool-config/services/the-pool-config.service';
import { NextFunction, Request, Response } from 'express';

/**
 * production 환경에서 api 를 없는 path 처럼 보이게 하는 middleware
 */
@Injectable()
export class UseDevelopmentMiddleware implements NestMiddleware {
  constructor(private readonly thePoolConfigService: ThePoolConfigService) {}

  use(request: Request, response: Response, next: NextFunction) {
    const isProduction = this.thePoolConfigService.isProduction();
    const { path, method } = request;

    if (isProduction) {
      throw new NotFoundException('Cannot' + ' ' + method + ' ' + path);
    }

    next();
  }
}
