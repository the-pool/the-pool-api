import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedResponseType {
  @ApiProperty({
    example: HttpStatus.UNAUTHORIZED,
  })
  status: number;

  @ApiProperty({
    example: '2022-12-31T06:02:38.866Z',
  })
  timestamp: string;
}
