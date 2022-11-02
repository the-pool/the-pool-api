import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ResponseErrorItem } from '@src/filters/type';

export const CustomApiResponse = (status: HttpStatus, errorMessage: string) => {
  class ErrorResponseType {
    @ApiProperty({
      description: 'http status code',
      example: status,
    })
    status: HttpStatus;

    @ApiProperty({
      description: '에러 발생 시각',
      example: '2022-07-26T08:39:02.274Z',
    })
    timestamp: Date;

    @ApiProperty({
      description: '에러 메시지',
      example: { message: errorMessage },
    })
    errors: ResponseErrorItem[];
  }

  return applyDecorators(
    ApiResponse({
      status,
      type: ErrorResponseType,
    }),
  );
};
