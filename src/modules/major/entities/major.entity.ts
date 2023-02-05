import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Major } from '@prisma/client';
import { MajorText } from '@src/constants/enum';
import { IdResponseType } from '@src/types/id-response-type';
import { MajorSkillEntity } from './major-skill.entity';

/**
 * @deprecated https://github.com/the-pool/the-pool-api/issues/76 수행 시 제거하면서 V2 를 사용
 */
export class MajorEntity extends IdResponseType implements Major {
  @ApiProperty({
    description: '분야 명',
    enum: MajorText,
  })
  name: MajorText | string;

  @ApiProperty({
    example: '2022-10-03T09:54:50.563Z',
    description: '생성일자',
  })
  createdAt: Date;

  @ApiPropertyOptional({
    description: '분야 의 메인스킬들',
    type: [MajorSkillEntity],
  })
  majorSkills?: MajorSkillEntity[];
}
