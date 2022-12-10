import { ApiProperty } from '@nestjs/swagger';
import { Major } from '@prisma/client';
import { IsRecord } from '@src/decorators/is-record.decorator';
import { Type } from 'class-transformer';
import { Min } from 'class-validator';

export class MajorIdRequestParamDto {
  @ApiProperty({
    description: '고유 ID',
    type: 'number',
    required: true,
  })
  @Min(1)
  @IsRecord<Major>({ model: 'major', field: 'id' }, true)
  @Type(() => Number)
  majorId: number;
}
