import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { ApiFailureResponse } from '@src/decorators/api-failure-response.decorator';
import { SolutionHashtagEntity } from '@src/modules/solution/entities/solution-hashtag.entity';

export const ApiCreateManySolutionHashtag = (summary: string) =>
  applyDecorators(
    ApiOperation({ summary }),
    ApiCreatedResponse({ type: SolutionHashtagEntity, isArray: true }),
    ApiFailureResponse(HttpStatus.BAD_REQUEST, [
      '등록 가능한 해시태그의 최대갯수는 5개입니다.',
    ]),
  );
