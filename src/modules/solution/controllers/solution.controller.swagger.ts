import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { HTTP_ERROR_MESSAGE } from '@src/constants/constant';
import { ApiFailureResponse } from '@src/decorators/api-failure-response.decorator';
import { ApiSuccessResponse } from '@src/decorators/api-success-response.decorator';
import { ReadOneSolutionEntity } from '@src/modules/solution/entities/read-one-solution.entity';
import { SolutionEntity } from '@src/modules/solution/entities/solution.entity';

export const ApiCreateSolution = (summary: string) =>
  applyDecorators(
    ApiOperation({ summary }),
    ApiCreatedResponse({ type: SolutionEntity }),
  );

export const ApiUpdateSolution = (summary: string) =>
  applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({ type: SolutionEntity }),
    ApiFailureResponse(HttpStatus.FORBIDDEN, HTTP_ERROR_MESSAGE.FORBIDDEN),
    ApiFailureResponse(HttpStatus.NOT_FOUND, HTTP_ERROR_MESSAGE.NOT_FOUND),
  );

export const ApiDeleteSolution = (summary: string) =>
  applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({ type: SolutionEntity }),
    ApiFailureResponse(HttpStatus.FORBIDDEN, HTTP_ERROR_MESSAGE.FORBIDDEN),
    ApiFailureResponse(HttpStatus.NOT_FOUND, HTTP_ERROR_MESSAGE.NOT_FOUND),
  );

export const ApiReadOneSolution = (summary: string) =>
  applyDecorators(
    ApiOperation({ summary }),
    ApiSuccessResponse(HttpStatus.OK, {
      solution: { type: ReadOneSolutionEntity },
    }),
    ApiFailureResponse(HttpStatus.NOT_FOUND, HTTP_ERROR_MESSAGE.NOT_FOUND),
    ApiFailureResponse(HttpStatus.NOT_FOUND, '존재하지 않는 solution입니다.'),
  );

export const ApiReadManySolution = (summary: string) =>
  applyDecorators(
    ApiOperation({ summary }),
    ApiSuccessResponse(
      HttpStatus.OK,
      {
        solutions: { type: SolutionEntity, isArray: true },
      },
      {
        totalCount: { type: 'number', example: 1 },
      },
    ),
    ApiFailureResponse(HttpStatus.NOT_FOUND, HTTP_ERROR_MESSAGE.NOT_FOUND),
  );
