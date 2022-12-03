import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { MainSkill } from '@prisma/client';
import { DateResponseType } from '@src/types/date-response.type';
import { IdResponseType } from '@src/types/id-response-type';

export class MainSkillEntity extends IdResponseType implements MainSkill {
  @ApiProperty({
    description: '스킬의 분야 고유 ID',
  })
  majorId: number;

  @ApiProperty({
    description: '스킬 명',
  })
  name: string;

  @ApiProperty({
    example: '2022-10-03T09:54:50.563Z',
    description: '생성일자',
  })
  createdAt: Date;
}
