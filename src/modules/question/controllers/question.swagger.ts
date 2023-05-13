import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { QuestionCategoryEntity } from '@src/modules/question/entities/question-category.entity';

export const ApiFindQuestionCategoryList = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({ type: QuestionCategoryEntity, isArray: true }),
  );
};
