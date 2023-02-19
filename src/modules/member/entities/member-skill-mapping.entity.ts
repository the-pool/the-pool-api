import { ApiProperty } from '@nestjs/swagger';
import { MemberSkillMapping } from '@prisma/client';
import { IdResponseType } from '@src/types/id-response-type';

export class MemberSkillMappingEntity
  extends IdResponseType
  implements MemberSkillMapping
{
  @ApiProperty({
    description: 'member 고유 ID',
    minimum: 1,
  })
  memberId: number;

  @ApiProperty({
    description: 'majorSkill 고유 ID',
    minimum: 1,
  })
  memberSkillId: number;

  @ApiProperty({
    example: '2022-10-03T09:54:50.563Z',
    description: '생성일자',
  })
  createdAt: Date;
}
