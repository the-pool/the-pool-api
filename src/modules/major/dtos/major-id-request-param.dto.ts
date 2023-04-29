import { ApiProperty } from '@nestjs/swagger';
import { Major } from '@prisma/client';
import { IsRecord } from '@src/decorators/is-record.decorator';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class MajorIdRequestParamDto {
  @ApiProperty({
    description: '고유 ID',
    type: 'number',
    required: true,
  })
  @IsRecord<Major>({ model: 'major', field: 'id' }, true)
  @Min(1)
  @IsInt()
  @Type(() => Number)
  majorId: number;
}
