import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseErrorItem } from '@src/filters/type';

export class InternalServerErrorResponseType {
  @ApiProperty({
    example: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  status: HttpStatus.INTERNAL_SERVER_ERROR;

  @ApiProperty({
    example: '2022-12-31T06:02:38.866Z',
  })
  timestamp: string;

  @ApiProperty({
    example: [
      {
        message: '서버 에러',
      },
    ],
  })
  errors: ResponseErrorItem[];
}
