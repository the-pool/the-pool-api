import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
} from '@nestjs/swagger';
import { getEntriesByEnum } from '@src/common/common';
import { DateResponseType } from '@src/types/date-response.type';
import { IdResponseType } from '@src/types/id-response-type';
import { Question } from '@prisma/client';
import { QuestionCategoryId } from '@src/constants/enum';
import { QuestionHashtagEntity } from './question-hashtag.entity';

export class QuestionEntity
  extends IntersectionType(IdResponseType, DateResponseType)
  implements Question {
  @ApiProperty({
    description: '질문을 생성한 멤버 고유 ID',
    example: 1,
  })
  memberId: number;

  @ApiProperty({
    description: '질문 카테고리',
    example: QuestionCategoryId.DevelopMent,
    enum: getEntriesByEnum(QuestionCategoryId),
  })
  categoryId: QuestionCategoryId;

  @ApiProperty({
    description: '질문 제목',
    example: 'title',
  })
  title: string;

  @ApiProperty({
    description: '질문 내용',
    example: 'description',
  })
  content: string;

  @ApiProperty({
    description: '질문 조회수',
    example: 3204,
  })
  hit: number;

  @ApiPropertyOptional({
    description: '질문이 가지는 hashtag entity',
  })
  hashtag?: QuestionHashtagEntity[];
}