import { ApiProperty } from '@nestjs/swagger';
import { Member } from '@prisma/client';
import { getValueByEnum } from '@src/common/common';
import { MajorId, MemberStatus } from '@src/constants/enum';
import { OAuthAgency } from '@src/modules/core/auth/constants/oauth.enums';

export class MemberModel implements Member {
  @ApiProperty({
    description: 'member 고유 id',
    required: true,
    type: 'number',
  })
  id: number;

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
    example: '2022-10-03T09:54:50.563Z',
    description: 'member 생성일자',
    required: true,
    type: 'string',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2022-10-03T09:54:50.563Z',
    description: 'member 정보 수정일자',
    required: true,
    type: 'string',
  })
  updatedAt: Date;

  @ApiProperty({
    example: '2022-10-03T09:54:50.563Z',
    description: 'member 회원 탈퇴일자',
    required: true,
    type: 'string',
  })
  deletedAt: Date | null;
}
