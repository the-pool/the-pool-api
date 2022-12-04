import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MainSkillEntity } from '../entities/main-skill.entoty';

export class MainSkillDto {
  @ApiProperty({
    description: '분야',
    type: MainSkillEntity,
  })
  @Type(() => MainSkillEntity)
  mainSkill: MainSkillEntity;
}
