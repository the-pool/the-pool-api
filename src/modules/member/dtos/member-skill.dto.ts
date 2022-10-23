import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class MemberSkillDto {
  @ApiProperty({
    example: 1,
    description: '입수전 마지막 단계에서 받는 관심 분야 검증',
    required: true,
    type: 'string',
  })
  // @IsEnum()
  nickname: number;
}
