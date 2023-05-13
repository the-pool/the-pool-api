import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { HTTP_ERROR_MESSAGE } from '@src/constants/constant';
import { ApiFailureResponse } from '@src/decorators/api-failure-response.decorator';
import { ApiSuccessResponse } from '@src/decorators/api-success-response.decorator';
import { ReadManyLessonDto } from '@src/modules/lesson/dtos/lesson/read-many-lesson.dto';
import { ReadOneLessonDto } from '@src/modules/lesson/dtos/lesson/read-one-lesson.dto';
import { LessonEntity } from '@src/modules/lesson/entities/lesson.entity';

export const ApiCreateLesson = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiSuccessResponse(HttpStatus.CREATED, { lesson: { type: LessonEntity } }),
  );
};

export const ApiUpdateLesson = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiSuccessResponse(HttpStatus.OK, {
      lesson: { type: LessonEntity },
    }),
    ApiFailureResponse(HttpStatus.FORBIDDEN, HTTP_ERROR_MESSAGE.FORBIDDEN),
    ApiFailureResponse(HttpStatus.NOT_FOUND, HTTP_ERROR_MESSAGE.NOT_FOUND),
  );
};

export const ApiDeleteLesson = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiSuccessResponse(HttpStatus.OK, {
      lesson: { type: LessonEntity },
    }),
    ApiFailureResponse(HttpStatus.FORBIDDEN, HTTP_ERROR_MESSAGE.FORBIDDEN),
    ApiFailureResponse(HttpStatus.NOT_FOUND, HTTP_ERROR_MESSAGE.NOT_FOUND),
  );
};

export const ApiReadOneLesson = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiSuccessResponse(HttpStatus.OK, { lesson: { type: ReadOneLessonDto } }),
    ApiFailureResponse(HttpStatus.NOT_FOUND, HTTP_ERROR_MESSAGE.NOT_FOUND),
  );
};

export const ApiReadManyLesson = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiSuccessResponse(
      HttpStatus.OK,
      {
        lessons: { type: ReadManyLessonDto, isArray: true },
      },
      { totalCount: { type: 'number', example: 1 } },
    ),
    ApiFailureResponse(HttpStatus.NOT_FOUND, HTTP_ERROR_MESSAGE.NOT_FOUND),
  );
};
