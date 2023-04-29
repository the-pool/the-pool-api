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
import { ApiSuccessResponse } from '@src/decorators/api-success-response.decorator';

export const ApiCreateComment = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiExtraModels(SolutionCommentEntity),
    ApiCreatedResponse({
      schema: {
        properties: {
          solutionComment: {
            $ref: getSchemaPath(SolutionCommentEntity),
          },
        },
      },
    }),
    ApiFailureResponse(HttpStatus.NOT_FOUND, HTTP_ERROR_MESSAGE.NOT_FOUND),
  );
};

export const ApiDeleteComment = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiExtraModels(SolutionCommentEntity),
    ApiOkResponse({
      schema: {
        properties: {
          solutionComment: {
            $ref: getSchemaPath(SolutionCommentEntity),
          },
        },
      },
    }),
    ApiFailureResponse(HttpStatus.FORBIDDEN, [
      HTTP_ERROR_MESSAGE.FORBIDDEN,
      'Active 상태의 유저만 접근 가능합니다.',
    ]),
    ApiFailureResponse(HttpStatus.NOT_FOUND, HTTP_ERROR_MESSAGE.NOT_FOUND),
  );
};

export const ApiUpdateComment = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiExtraModels(SolutionCommentEntity),
    ApiOkResponse({
      schema: {
        properties: {
          solutionComment: {
            $ref: getSchemaPath(SolutionCommentEntity),
          },
        },
      },
    }),
    ApiFailureResponse(HttpStatus.FORBIDDEN, [
      HTTP_ERROR_MESSAGE.FORBIDDEN,
      'Active 상태의 유저만 접근 가능합니다.',
    ]),
    ApiFailureResponse(HttpStatus.NOT_FOUND, HTTP_ERROR_MESSAGE.NOT_FOUND),
  );
};

export const ApiReadManyComment = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiExtraModels(SolutionCommentEntity),
    ApiSuccessResponse(
      HttpStatus.OK,
      {
        solutionComments: { type: SolutionCommentEntity, isArray: true },
      },
      { totalCount: { type: 'number' } },
    ),
  );
};
