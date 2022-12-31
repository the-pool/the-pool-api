import { ApiProperty } from '@nestjs/swagger';
import { ResponseErrorItem } from '@src/filters/type';
import { BadRequestResponseType } from '@src/types/bad-request.response.type';

export class MemberLoginOrSignUpBadRequestResponseType extends BadRequestResponseType {
  @ApiProperty({
    description: 'example 중 하나만 나옵니다.',
    example: [
      {
        message: '이미 존재하는 유저입니다.',
      },
    ],
  })
  errors: ResponseErrorItem[];
}
