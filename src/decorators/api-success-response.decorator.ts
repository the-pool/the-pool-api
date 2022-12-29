import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ErrorHttpStatusCode } from '@nestjs/common/utils/http-error-by-code.util';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';

/**
 * 성공에 대한 응답을 swagger상에 보여주고 싶은데 필드명을 커스텀 하고 싶을 때
 * 사용하는 데코레이터이며 원하는데로 필드와 타입을 지정해 줄 수 있다.
 */
export const ApiSuccessResponse = (
  status: Exclude<HttpStatus, ErrorHttpStatusCode>,
  filed: string,
  type: any,
) => {
  class Prop {
    @ApiProperty({
      description: '설명',
      type,
      name: filed,
    })
    property;
  }
  return applyDecorators(ApiResponse({ status, type: Prop }));
};
