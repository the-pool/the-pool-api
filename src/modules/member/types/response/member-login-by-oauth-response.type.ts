import { ApiProperty } from '@nestjs/swagger';
import { getValueByEnum } from '@src/common/common';
import { MemberStatus } from '../../constants/member.enum';

export class MemberLoginByOAuthResponseType {
  @ApiProperty({
    description: '발급된 accessToken',
    required: true,
    type: 'string',
  })
  accessToken: string;

  @ApiProperty({
    description: '유저 추가 정보 입력 받아야 하는지 유무',
    required: true,
    enum: getValueByEnum(MemberStatus, 'number'),
  })
  status: MemberStatus;
}
