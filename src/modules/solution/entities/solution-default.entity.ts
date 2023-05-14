import { ApiProperty } from '@nestjs/swagger';

export class SolutionDefaultEntity {
  @ApiProperty({
    description: '성공 관련 문자열',
    example: 'delete like success',
  })
  message: string;
}
