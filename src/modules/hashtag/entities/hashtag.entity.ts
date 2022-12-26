import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { DateResponseType } from '@src/types/date-response.type';
import { IdResponseType } from '@src/types/id-response-type';

export class HashtagEntity extends IntersectionType(
  IdResponseType,
  DateResponseType,
) {
  @ApiProperty({
    example: 1,
    description: 'hashtag에 해당하는 객체(과제, 유저의 프로필 등등)의 고유 ID',
  })
  modelId: number;

  @ApiProperty({
    example: 'the-pool',
    description: 'hashtag',
  })
  tag: string;
}
