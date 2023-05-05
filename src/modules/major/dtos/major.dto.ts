import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  PickType,
} from '@nestjs/swagger';
import { MajorText } from '@src/constants/enum';
import { MajorSkillEntity } from '@src/modules/major/entities/major-skill.entity';
import { DateResponseType } from '@src/types/date-response.type';
import { IdResponseType } from '@src/types/id-response-type';

export class MajorDto extends IntersectionType(
  IdResponseType,
  PickType(DateResponseType, ['createdAt']),
) {
  @ApiProperty({
    description: '분야 명',
    enum: MajorText,
  })
  name: MajorText | string;

  @ApiPropertyOptional({
    description: '분야 의 메인스킬들',
    type: [MajorSkillEntity],
  })
  majorSkills?: MajorSkillEntity[];
}
