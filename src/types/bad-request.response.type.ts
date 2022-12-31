import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class BadRequestResponseType {
  @ApiProperty({
    example: HttpStatus.BAD_REQUEST,
  })
  status: HttpStatus.BAD_REQUEST;

  @ApiProperty({
    example: '2022-12-31T06:02:38.866Z',
  })
  timestamp: string;
}
