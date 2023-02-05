import { applyDecorators, HttpStatus } from "@nestjs/common"
import { ApiOkResponse, ApiOperation } from "@nestjs/swagger"
import { ApiSuccessResponse } from "@src/decorators/api-success-response.decorator"
import { QuestionCategoryEntity } from "../entities/question-category.entity"

export const ApiFindQuestionCategoryList = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({ type: QuestionCategoryEntity, isArray: true })
  )
}