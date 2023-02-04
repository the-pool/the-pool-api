import { ApiProperty } from "@nestjs/swagger";
import { QuestionCategory } from "@prisma/client";
import { IdResponseType } from "@src/types/id-response-type";


type WithoutDate = Omit<QuestionCategory, 'createdAt'>;

export class QuestionCategoryEntity extends IdResponseType implements WithoutDate {
  @ApiProperty({
    example: '개발',
    description: 'Question 카테고리명'
  })
  name: string;
}