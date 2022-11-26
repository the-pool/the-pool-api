import { ApiProperty } from '@nestjs/swagger';
import { getEntriesByEnum } from '@src/common/common';
import { AccessTokenType } from '@src/modules/user/types/access-token.type';
import { MemberStatus } from '../../constants/member.enum';

export class MemberLoginByOAuthResponseType extends AccessTokenType {
  @ApiProperty({
    description: '유저 추가 정보 입력 받아야 하는지 유무',
    example: 1,
    enum: getEntriesByEnum(MemberStatus),
  })
  status: MemberStatus;
}
