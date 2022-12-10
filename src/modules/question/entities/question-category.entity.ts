import { ApiProperty, IntersectionType } from "@nestjs/swagger";
import { QuestionCategory } from "@prisma/client";
import { DateResponseType } from "@src/types/date-response.type";
import { IdResponseType } from "@src/types/id-response-type";


export class QuestionCategoryEntity
  extends IntersectionType(IdResponseType, DateResponseType)
  implements QuestionCategory {
  @ApiProperty({
    example: '개발',
    description: '질문 카테고리 이름'
  })
  category: string;
}