import { ApiOperation, ApiProperty, IntersectionType } from "@nestjs/swagger";
import { Question } from "@prisma/client";
import { getEntriesByEnum } from "@src/common/common";
import { QuestionCategoryId } from "@src/constants/enum";
import { DateResponseType } from "@src/types/date-response.type";
import { IdResponseType } from "@src/types/id-response-type";


export class QuestionEntity
  extends IntersectionType(IdResponseType, DateResponseType)
  implements Question {

  @ApiProperty({
    description: '작성한 member의 고유 ID',
    example: 1
  })
  memberId: number;

  @ApiProperty({
    description: '카테고리의 고유 ID',
    enum: getEntriesByEnum(QuestionCategoryId)
  })
  categoryId: QuestionCategoryId;

  @ApiProperty({
    description: `제목`
  })
  title: string;

  @ApiProperty({
    description: `내용`,
    example: 'html 형식 or markdown 형식의 string'
  })
  content: string;

  @ApiProperty({
    description: `조회 수`,
    example: 0
  })
  hit: number;
}