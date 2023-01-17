import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CountEvaluationDto {
  @ApiProperty({
    example: 1,
    description: '난이도 상',
  })
  @Type(() => Number)
  top: number = 0;

  @ApiProperty({
    example: 5,
    description: '난이도 중',
  })
  @Type(() => Number)
  middle: number = 0;

  @ApiProperty({
    example: 10,
    description: '난이도 하',
  })
  @Type(() => Number)
  bottom: number = 0;
}