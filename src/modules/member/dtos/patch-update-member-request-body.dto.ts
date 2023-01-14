import { ApiPropertyOptional } from '@nestjs/swagger';
import { getEntriesByEnum } from '@src/common/common';
import { MemberStatus } from '@src/modules/member/constants/member.enum';
import { IsEnum, IsOptional, MaxLength } from 'class-validator';

export class PatchUpdateMemberRequestBodyDto {
  @ApiPropertyOptional({
    description: 'member nickname',
    maxLength: 30,
  })
  @MaxLength(30)
  @IsOptional()
  nickname?: string;

  @ApiPropertyOptional({
    description: '멤버 본명이 아닌 표시 이름',
    default: 'uuid',
    maxLength: 255,
  })
  @MaxLength(255)
  @IsOptional()
  memberName?: string;

  @ApiPropertyOptional({
    description: '멤버 직업',
    maxLength: 255,
  })
  @MaxLength(255)
  @IsOptional()
  job?: string;

  @ApiPropertyOptional({
    description: '멤버 상태',
    example: 1,
    enum: getEntriesByEnum(MemberStatus),
  })
  @IsEnum(MemberStatus)
  @IsOptional()
  status?: MemberStatus;

  @ApiPropertyOptional({
    description: '멤버 썸네일 url',
    maxLength: 255,
  })
  @MaxLength(255)
  @IsOptional()
  thumbnail?: string;

  @ApiPropertyOptional({
    description: '멤버 본인 설명 글',
  })
  @IsOptional()
  introduce?: string;
}
