import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { DateResponseType } from '@src/types/date-response.type';
import { IdResponseType } from '@src/types/id-response-type';

export class MajorSkillDto extends IntersectionType(
  IdResponseType,
  PickType(DateResponseType, ['createdAt']),
) {
  @ApiProperty({
    description: '스킬의 분야 고유 ID',
  })
  majorId: number;

  @ApiProperty({
    description: '스킬 명',
  })
  name: string;
}
