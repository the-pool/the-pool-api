import { ApiPropertyOptional } from '@nestjs/swagger';
import { getEntriesByEnum } from '@src/common/common';
import { MemberStatus } from '@src/modules/member/constants/member.enum';
import { MemberSocialLinkDto } from '@src/modules/member/dtos/member-social-link.dto';
import { MemberEntity } from '@src/modules/member/entities/member.entity';
import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsOptional,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class PatchUpdateMemberRequestBodyDto implements Partial<MemberEntity> {
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

  @ApiPropertyOptional({
    description:
      'member 의 social link list <br/> ' +
      '보내준 리스트로 최종적으로 저장합니다.',
    type: [MemberSocialLinkDto],
  })
  @ArrayUnique()
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => MemberSocialLinkDto)
  memberSocialLinks?: MemberSocialLinkDto[];
}
