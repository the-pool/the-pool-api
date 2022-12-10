import { ApiProperty, IntersectionType } from "@nestjs/swagger";
import { IdResponseType } from "@src/types/id-response-type";
import { DateResponseType } from '@src/types/date-response.type';
import { QuestionHashtag } from "@prisma/client";


export class QuestionHashtagEntity
  extends IntersectionType(IdResponseType, DateResponseType)
  implements QuestionHashtag {

  @ApiProperty({
    example: 1,
    description: 'hashtag를 가지는 질문 고유 ID'
  })
  questionId: number;

  @ApiProperty({
    example: '개발',
    description: 'hashtag 이름'
  })
  tag: string;
}