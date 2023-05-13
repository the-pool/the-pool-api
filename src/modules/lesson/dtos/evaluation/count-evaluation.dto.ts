import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CountEvaluationDto {
  @ApiProperty({
    example: 1,
    description: '난이도 상',
  })
  @Type(() => Number)
  top = 0;

  @ApiProperty({
    example: 5,
    description: '난이도 중',
  })
  @Type(() => Number)
  middle = 0;

  @ApiProperty({
    example: 10,
    description: '평가된 갯수',
  })
  @Type(() => Number)
  bottom = 0;
}
