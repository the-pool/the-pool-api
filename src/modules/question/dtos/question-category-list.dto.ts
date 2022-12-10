import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { QuestionCategoryEntity } from "../entities/question-category.entity";

export class QuestionCategoryListDto {
  @ApiProperty({
    description: '질문 카테고리 리스트',
    type: [QuestionCategoryEntity]
  })
  @Type(() => QuestionCategoryEntity)
  categories: QuestionCategoryEntity[]
}