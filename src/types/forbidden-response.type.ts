import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ForbiddenResponseType {
  @ApiProperty({
    example: HttpStatus.FORBIDDEN,
  })
  status: HttpStatus.FORBIDDEN;

  @ApiProperty({
    example: '2022-12-31T06:02:38.866Z',
  })
  timestamp: string;
}
