import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { HTTP_ERROR_MESSAGE } from '@src/constants/constant';
import { ApiFailureResponse } from '@src/decorators/api-failure-response.decorator';
import { ApiSuccessResponse } from '@src/decorators/api-success-response.decorator';
import { ReadLessonHashtagDto } from '../dtos/hashtag/read-many-lesson-hashtag.dto';
import { LessonHashtagMappingEntity } from '../entities/lesson-hashtag-mapping.entity';
import { LessonHashtagEntity } from '../entities/lesson-hashtag.entity';

export const ApiCreateManyHashtag = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiSuccessResponse(HttpStatus.CREATED, {
      lessonHashtags: { type: ReadLessonHashtagDto, isArray: true },
    }),
    ApiFailureResponse(HttpStatus.FORBIDDEN, HTTP_ERROR_MESSAGE.FORBIDDEN),
    ApiFailureResponse(HttpStatus.NOT_FOUND, HTTP_ERROR_MESSAGE.NOT_FOUND),
  );
};

export const ApiUpdateManyHashtag = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiSuccessResponse(HttpStatus.OK, {
      lessonHashtags: { type: ReadLessonHashtagDto, isArray: true },
    }),
    ApiFailureResponse(HttpStatus.FORBIDDEN, HTTP_ERROR_MESSAGE.FORBIDDEN),
    ApiFailureResponse(HttpStatus.NOT_FOUND, HTTP_ERROR_MESSAGE.NOT_FOUND),
  );
};

export const ApiUpdateOneHashtag = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiSuccessResponse(HttpStatus.OK, {
      lessonHashtag: { type: ReadLessonHashtagDto },
    }),
    ApiFailureResponse(HttpStatus.FORBIDDEN, HTTP_ERROR_MESSAGE.FORBIDDEN),
    ApiFailureResponse(HttpStatus.NOT_FOUND, HTTP_ERROR_MESSAGE.NOT_FOUND),
  );
};

export const APiDeleteOneHashtag = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiSuccessResponse(HttpStatus.OK, {
      hashtag: { type: LessonHashtagEntity },
    }),
    ApiFailureResponse(HttpStatus.FORBIDDEN, HTTP_ERROR_MESSAGE.FORBIDDEN),
    ApiFailureResponse(HttpStatus.NOT_FOUND, HTTP_ERROR_MESSAGE.NOT_FOUND),
  );
};

export const ApiReadManyHashtag = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiSuccessResponse(HttpStatus.OK, {
      hashtags: { type: LessonHashtagEntity, isArray: true },
    }),
    ApiFailureResponse(HttpStatus.NOT_FOUND, HTTP_ERROR_MESSAGE.NOT_FOUND),
  );
};

export const ApiReadOneHashtag = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiSuccessResponse(HttpStatus.OK, {
      hashtag: { type: LessonHashtagEntity },
    }),
    ApiFailureResponse(HttpStatus.FORBIDDEN, HTTP_ERROR_MESSAGE.FORBIDDEN),
    ApiFailureResponse(HttpStatus.NOT_FOUND, HTTP_ERROR_MESSAGE.NOT_FOUND),
  );
};
