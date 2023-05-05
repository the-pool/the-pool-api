import { ApiProperty } from '@nestjs/swagger';
import { MajorSkill } from '@prisma/client';
import { IsRecord } from '@src/decorators/is-record.decorator';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class MajorSkillIdRequestParamDto {
  @ApiProperty({
    description: '고유 ID',
    type: 'number',
    required: true,
  })
  @IsRecord<MajorSkill>({ model: 'majorSkill', field: 'id' }, true)
  @Min(1)
  @IsInt()
  @Type(() => Number)
  majorSkillId: number;
}
