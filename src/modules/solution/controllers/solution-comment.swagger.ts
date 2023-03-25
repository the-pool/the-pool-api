import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { HTTP_ERROR_MESSAGE } from '@src/constants/constant';
import { ApiFailureResponse } from '@src/decorators/api-failure-response.decorator';
import { SolutionCommentEntity } from '../entities/solution-comment.entity';

export const ApiCreateComment = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiExtraModels(SolutionCommentEntity),
    ApiCreatedResponse({ type: SolutionCommentEntity }),
    ApiFailureResponse(HttpStatus.NOT_FOUND, HTTP_ERROR_MESSAGE.NOT_FOUND),
  );
};
