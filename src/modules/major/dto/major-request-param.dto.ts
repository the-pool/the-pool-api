import { ApiProperty } from '@nestjs/swagger';
import { MainSkill, Major } from '@prisma/client';
import { IsRecord } from '@src/decorators/is-record.decorator';
import { Type } from 'class-transformer';
import { Min } from 'class-validator';

export class MajorRequestParamDto {
  @ApiProperty({
    description: '고유 ID',
    type: 'number',
    required: true,
  })
  @Min(1)
  @Type(() => Number)
  @IsRecord<Major>({ model: 'major', field: 'id' }, true)
  majorId: number;

  @ApiProperty({
    description: '고유 ID',
    type: 'number',
    required: true,
  })
  @Min(1)
  @Type(() => Number)
  @IsRecord<MainSkill>({ model: 'major', field: 'id' }, true)
  mainSkillid: number;
}
