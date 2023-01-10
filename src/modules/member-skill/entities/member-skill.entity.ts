import { ApiProperty } from '@nestjs/swagger';
import { MemberSkill } from '@prisma/client';
import { IdResponseType } from '@src/types/id-response-type';

export class MemberSkillEntity extends IdResponseType implements MemberSkill {
  @ApiProperty({
    description: 'skill 명',
  })
  name: string;

  @ApiProperty({
    example: '😃',
    description: 'skill 이모티콘',
  })
  emoji: string;

  @ApiProperty({
    example: '2022-10-03T09:54:50.563Z',
    description: '생성일자',
  })
  createdAt: Date;
}
