import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { getValueByEnum } from '@src/common/common';
import { MajorId, MemberStatus } from '@src/constants/enum';
import { OAuthAgency } from '@src/modules/core/auth/constants/oauth.enums';
import { DateResponseType } from '@src/types/date-response.type';
import { IdResponseType } from '@src/types/id-response-type';
import { Member } from '@prisma/client';

export class MemberEntity
  extends IntersectionType(IdResponseType, DateResponseType)
  implements Member
{
  @ApiProperty({
    description: 'member의 작업분야',
    required: true,
    type: 'number',
    enum: getValueByEnum(MajorId, 'number'),
  })
  majorId: number;

  @ApiProperty({
    description: 'member의 소셜(kakao,google,apple) 계정 id',
    required: true,
    type: 'string',
  })
  account: string;

  @ApiProperty({
    description: 'member의 닉네임',
    required: true,
    type: 'string',
  })
  nickname: string;

  @ApiProperty({
    description: 'member의 상태',
    required: true,
    type: 'string',
    enum: getValueByEnum(MemberStatus, 'number'),
  })
  status: number;

  @ApiProperty({
    description: 'member의 상태',
    required: true,
    type: 'number',
    enum: getValueByEnum(OAuthAgency, 'number'),
  })
  loginType: number;

  @ApiProperty({
    description: 'member의 프로필 이미지',
    required: false,
    type: 'string',
  })
  thumbnail: string;

  @ApiProperty({
    description: 'member의 소개글',
    required: false,
    type: 'string',
  })
  introduce: string;
}
