import { applyDecorators, HttpStatus } from "@nestjs/common"
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiBearerAuth } from "@nestjs/swagger"
import { ApiFailureResponse } from "@src/decorators/api-failure-response.decorator"
import { ApiSuccessResponse } from "@src/decorators/api-success-response.decorator"
import { QuestionCategoryEntity } from "../entities/question-category.entity"
import { QuestionEntity } from "../entities/question.entity"

export const ApiFindQuestionCategoryList = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({ type: QuestionCategoryEntity, isArray: true })
  )
}

export const ApiCreateQuestion = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBearerAuth(),
    ApiCreatedResponse({ type: QuestionEntity }),
    ApiFailureResponse(HttpStatus.UNAUTHORIZED, 'Unauthorized'),
  )
}