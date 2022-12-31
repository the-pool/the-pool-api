import { ApiProperty } from '@nestjs/swagger';
import { ResponseErrorItem } from '@src/filters/type';
import { UnauthorizedResponseType } from '@src/types/unauthorized-response.type';

export class MemberLoginOrSignUpUnauthorizedResponseType extends UnauthorizedResponseType {
  @ApiProperty({
    description: 'example 중 하나만 나옵니다.',
    example: [
      {
        message: '유효하지 않은 토큰입니다.',
      },
    ],
  })
  errors: ResponseErrorItem[];
}
