import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseErrorItem } from '@src/filters/type';

export class NotFoundResponseType {
  @ApiProperty({
    example: HttpStatus.NOT_FOUND,
  })
  status: HttpStatus.NOT_FOUND;

  @ApiProperty({
    example: '2022-12-31T06:02:38.866Z',
  })
  timestamp: string;

  @ApiProperty({
    example: [
      {
        message: '존재하지 않는 리소스입니다.',
      },
    ],
  })
  errors: ResponseErrorItem[];
}
