import { ApiProperty, IntersectionType, PickType } from "@nestjs/swagger";
import { QuestionCategory } from "@prisma/client";
import { DateResponseType } from "@src/types/date-response.type";
import { IdResponseType } from "@src/types/id-response-type";


export class QuestionCategoryEntity
  extends IntersectionType(
    IdResponseType,
    PickType(DateResponseType, ['createdAt'])
  )
  implements QuestionCategory {
  @ApiProperty({
    example: '개발',
    description: 'Question 카테고리명'
  })
  name: string;
}