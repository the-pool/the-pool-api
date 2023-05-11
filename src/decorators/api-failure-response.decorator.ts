import { applyDecorators } from '@nestjs/common';
import { ErrorHttpStatusCode } from '@nestjs/common/utils/http-error-by-code.util';
import { ApiResponse } from '@nestjs/swagger';

export const ApiFailureResponse = (
  status: ErrorHttpStatusCode,
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
