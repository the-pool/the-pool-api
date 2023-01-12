import { ApiProperty } from '@nestjs/swagger';
import { MemberInterest } from '@prisma/client';
import { IdResponseType } from '@src/types/id-response-type';

export class MemberInterestEntity
  extends IdResponseType
  implements MemberInterest
{
  @ApiProperty({
    description: '관심사 명',
  })
  name: string;

  @ApiProperty({
    example: '2022-10-03T09:54:50.563Z',
    description: '생성일자',
  })
  createdAt: Date;
}
