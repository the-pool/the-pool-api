import { ApiProperty } from '@nestjs/swagger';
import { MainSkill } from '@prisma/client';
import { IsRecord } from '@src/decorators/is-record.decorator';
import { Type } from 'class-transformer';
import { Min } from 'class-validator';

export class MainSkillIdRequestParamDto {
  @ApiProperty({
    description: '고유 ID',
    type: 'number',
    required: true,
  })
  @Min(1)
  @IsRecord<MainSkill>({ model: 'mainSkill', field: 'id' }, true)
  @Type(() => Number)
  mainSkillId: number;
}
