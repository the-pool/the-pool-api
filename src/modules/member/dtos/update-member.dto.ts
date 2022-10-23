import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { MemberSkillDto } from './member-skill.dto';

export class UpdateMemberDto {
  @ApiProperty({
    example: 'thePool',
    description: '입수전 마지막 단계에서 받는 닉네임',
    required: true,
    type: 'string',
  })
  @IsString()
  nickname: string;

  @ApiProperty({
    example: 1,
    description: '입수전 마지막 단계에서 받는 유저 작업 분야',
    required: true,
    type: 'number',
  })
  @IsNumber()
  //   @IsEnum()
  majorId: number;

  @ApiProperty({
    example: [1, 2, 3, 4, 5],
    description: '입수전 마지막 단계에서 받는 유저 관심분야',
    required: true,
    type: 'number',
  })
  @IsArray()
  @ArrayMaxSize(10)
  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => MemberSkillDto)
  memberSkill: number[];
}
