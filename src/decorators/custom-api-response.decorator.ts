import { ApiResponse } from '@nestjs/swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';

export const CustomApiResponse = (
  status: HttpStatus,
  errorMessage: string | string[],
) => {
  if (typeof errorMessage === 'string') {
    errorMessage = [errorMessage];
  }

  const errors = errorMessage.map((error) => {
    return { message: error };
  });

  return applyDecorators(
    ApiResponse({
      status,
      schema: {
        example: {
          status,
          timestamp: '2022-07-26T08:39:02.274Z',
          errors,
        },
      },
    }),
  );
};
