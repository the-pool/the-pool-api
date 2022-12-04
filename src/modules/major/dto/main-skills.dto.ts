import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MainSkillEntity } from '../entities/main-skill.entity';

export class MainSkillsDto {
  @ApiProperty({
    description: '분야',
    type: [MainSkillEntity],
  })
  @Type(() => MainSkillEntity)
  mainSkills: MainSkillEntity[];
}
