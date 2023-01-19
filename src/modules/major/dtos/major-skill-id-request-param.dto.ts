import { ApiProperty } from '@nestjs/swagger';
import { MajorSkill } from '@prisma/client';
import { IsRecord } from '@src/decorators/is-record.decorator';
import { Type } from 'class-transformer';
import { Min } from 'class-validator';

export class MajorSkillIdRequestParamDto {
  @ApiProperty({
    description: '고유 ID',
    type: 'number',
    required: true,
  })
  @Min(1)
  @IsRecord<MajorSkill>({ model: 'majorSkill', field: 'id' }, true)
  @Type(() => Number)
  majorSkillId: number;
}
