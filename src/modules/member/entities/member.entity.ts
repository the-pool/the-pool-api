import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
} from '@nestjs/swagger';
import { Member } from '@prisma/client';
import { getEntriesByEnum, getStrMapByObject } from '@src/common/common';
import { MajorId } from '@src/constants/enum';
import { MEMBER_ACCOUNT_PREFIX } from '@src/modules/member/constants/member.const';
import { DateResponseType } from '@src/types/date-response.type';
import { IdResponseType } from '@src/types/id-response-type';
import { MemberLoginType, MemberStatus } from '../constants/member.enum';

export class MemberEntity
  extends IntersectionType(IdResponseType, DateResponseType)
  implements Member
{
  @ApiProperty({
    description: 'member의 작업분야',
    example: 1,
    enum: getEntriesByEnum(MajorId),
  })
  majorId: MajorId | null;

  @ApiProperty({
    description:
      'member의 소셜 계정 id </br>' +
      'prefix 와 id 의 구분자는 - </br>' +
      'provider 별 prefix ' +
      getStrMapByObject(MEMBER_ACCOUNT_PREFIX),
    example: 'k-123456789',
  })
  account: string;

  @ApiProperty({
    description: 'member의 닉네임',
    example: 'the-pool',
  })
  nickname: string | null;

  @ApiProperty({
    description: 'member 노출명',
    default: 'uuid',
  })
  memberName: string;

  @ApiProperty({
    description: 'member 가 지정한 직업',
    example: '백엔드 개발자',
    nullable: true,
  })
  job: string | null;

  @ApiProperty({
    description: 'member의 상태',
    example: 0,
    enum: getEntriesByEnum(MemberStatus),
  })
  status: MemberStatus;

  @ApiProperty({
    description: 'member의 소셜 종류',
    example: 1,
    enum: getEntriesByEnum(MemberLoginType),
  })
  loginType: MemberLoginType;

  @ApiProperty({
    description: 'member의 프로필 이미지',
    example: 'profile.img',
  })
  thumbnail: string | null;

  @ApiPropertyOptional({
    description: 'member의 소개글',
    example: 'the-pool 화이팅',
  })
  introduce: string | null;
}
