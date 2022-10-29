import { ApiProperty } from '@nestjs/swagger';
import { getValueByEnum } from '@src/common/common';
import { MajorId, MajorSkillId } from '@src/constants/enum';
import { IsRecord } from '@src/decorators/is-record.decorator';
import { UserLogin } from '@src/decorators/user-login.decorator';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class LastStepLoginDto {
  @ApiProperty({
    example: 'thePool',
    description: '입수전 마지막 단계에서 받는 닉네임',
    required: true,
    type: 'string',
  })
  @IsRecord({ model: 'member' }, false)
  @IsString()
  nickname: string;

  @ApiProperty({
    example: 1,
    description: '입수전 마지막 단계에서 받는 유저 작업 분야',
    required: true,
    enum: getValueByEnum(MajorId, 'number'),
    type: 'number',
  })
  @IsNumber()
  @IsNotEmpty()
  @IsEnum(MajorId)
  majorId: number;

  @ApiProperty({
    example: [1, 2, 3, 4, 5],
    description: '입수전 마지막 단계에서 받는 유저 관심분야',
    required: true,
    enum: getValueByEnum(MajorSkillId, 'number'),
    type: 'number',
  })
  @IsArray()
  @ArrayMaxSize(10)
  @ArrayNotEmpty()
  @IsEnum(MajorSkillId, { each: true })
  memberSkill: MajorSkillId[];
}
