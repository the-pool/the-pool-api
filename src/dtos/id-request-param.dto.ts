import { ApiProperty } from '@nestjs/swagger';
import { IsRecord } from '@src/decorators/is-record.decorator';
import { PrismaModelName } from '@src/types/type';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class IdRequestParamDto {
  @ApiProperty({
    description: '고유 ID',
    type: 'number',
    required: true,
    minimum: 1,
  })
  @IsRecord({}, true)
  @Min(1)
  @IsInt()
  @Type(() => Number)
  id: number;

  @IsOptional()
  model: PrismaModelName;
}
