import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MajorSkillEntity } from '../entities/major-skill.entity';

export class MajorSkillDto {
  @ApiProperty({
    description: '분야',
    type: MajorSkillEntity,
  })
  @Type(() => MajorSkillEntity)
  majorSkill: MajorSkillEntity;
}
