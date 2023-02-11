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
import { LessonHashtagMappingEntity } from '../entities/lesson-hashtag-mapping.entity';
import { LessonHashtagEntity } from '../entities/lesson-hashtag.entity';

export const ApiCreateManyHashtag = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiExtraModels(LessonHashtagMappingEntity, LessonHashtagEntity),
    ApiCreatedResponse({
      schema: {
        properties: {
          lessonHashtags: {
            $ref: getSchemaPath(LessonHashtagMappingEntity),
            properties: {
              lessonHashtag: {
                $ref: getSchemaPath(LessonHashtagEntity),
              },
            },
          },
        },
      },
    }),
    ApiFailureResponse(HttpStatus.FORBIDDEN, HTTP_ERROR_MESSAGE.FORBIDDEN),
    ApiFailureResponse(HttpStatus.NOT_FOUND, HTTP_ERROR_MESSAGE.NOT_FOUND),
  );
};

export const ApiUpdateManyHashtag = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({
      schema: {
        properties: {
          lessonHashtags: {
            $ref: getSchemaPath(LessonHashtagMappingEntity),
            properties: {
              lessonHashtag: {
                $ref: getSchemaPath(LessonHashtagEntity),
              },
            },
          },
        },
      },
    }),
    ApiFailureResponse(HttpStatus.FORBIDDEN, HTTP_ERROR_MESSAGE.FORBIDDEN),
    ApiFailureResponse(HttpStatus.NOT_FOUND, HTTP_ERROR_MESSAGE.NOT_FOUND),
  );
};

export const APiDeleteManyHashtag = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({ schema: { example: { count: 1 } } }),
    ApiFailureResponse(HttpStatus.FORBIDDEN, HTTP_ERROR_MESSAGE.FORBIDDEN),
    ApiFailureResponse(HttpStatus.NOT_FOUND, [
      HTTP_ERROR_MESSAGE.NOT_FOUND,
      `{modelName}에 존재하지 않는 관계 입니다.`,
    ]),
  );
};

export const ApiReadManyHashtag = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({
      schema: {
        properties: {
          lessonHashtags: {
            $ref: getSchemaPath(LessonHashtagMappingEntity),
            properties: {
              lessonHashtag: {
                $ref: getSchemaPath(LessonHashtagEntity),
              },
            },
          },
        },
      },
    }),
    ApiFailureResponse(HttpStatus.NOT_FOUND, HTTP_ERROR_MESSAGE.NOT_FOUND),
  );
};
