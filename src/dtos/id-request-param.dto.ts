import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { IsRecord } from '@src/decorators/is-record.decorator';
import { PrismaModelName } from '@src/types/type';

export class IdRequestParamDto {
  @ApiProperty({
    description: '고유 ID',
    type: 'number',
    required: true,
  })
  @Min(1)
  @Type(() => Number)
  @IsRecord({}, true)
  id: number;

  @IsOptional()
  model: PrismaModelName;
}
