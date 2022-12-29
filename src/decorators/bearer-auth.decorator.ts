import { applyDecorators, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { JwtGuard } from '@src/types/type';
import { ApiFailureResponse } from './api-failure-response.decorator';

/**
 * swagger와 guard에 필요한 jwt관련 데코레이터들을 한번에 처리하는 데코레이터
 */
export const BearerAuth = (guard: JwtGuard = JwtAuthGuard) => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiFailureResponse(HttpStatus.UNAUTHORIZED, 'Unauthorized'),
    UseGuards(guard),
  );
};
