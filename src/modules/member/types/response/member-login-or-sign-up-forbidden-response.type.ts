import { ApiProperty } from '@nestjs/swagger';
import { ResponseErrorItem } from '@src/filters/type';
import { ForbiddenResponseType } from '@src/types/forbidden-response.type';

export class MemberLoginOrSignUpForbiddenResponseType extends ForbiddenResponseType {
  @ApiProperty({
    description: 'example 중 하나만 나옵니다.',
    example: [
      {
        message: '유효하지 않은 토큰입니다.',
      },
      {
        message: '추가정보 입력이 필요한 유저입니다.',
      },
      {
        message: '비활성된 유저입니다.',
      },
    ],
  })
  errors: ResponseErrorItem[];
}
