import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MajorSkillEntity } from '../entities/major-skill.entity';

export class MajorSkillListDto {
  @ApiProperty({
    description: '분야',
    type: [MajorSkillEntity],
  })
  @Type(() => MajorSkillEntity)
  majorSkills: MajorSkillEntity[];
}
