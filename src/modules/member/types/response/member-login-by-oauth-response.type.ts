import { ApiProperty } from '@nestjs/swagger';
import { getEntriesByEnum } from '@src/common/common';
import { MemberStatus } from '../../constants/member.enum';

export class MemberLoginByOAuthResponseType {
  @ApiProperty({
    description: '유저 추가 정보 입력 받아야 하는지 유무',
    example: 1,
    enum: getEntriesByEnum(MemberStatus),
  })
  status: MemberStatus;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTI1LCJpYXQiOjE2NjQ4OTA4ODcsImV4cCI6MTk4MDQ2Njg4N30.BRWIIE2pv1L0lzmw4KlCqRZZZo3CT8bsgHekpfzUe38',
    description: 'the-pool 고유 accessToken',
    required: true,
    type: 'string',
  })
  accessToken?: string;
}
