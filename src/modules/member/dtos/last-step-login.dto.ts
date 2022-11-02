import { ApiProperty } from '@nestjs/swagger';
import { getValueByEnum } from '@src/common/common';
import { MajorId, MajorSkillId } from '@src/constants/enum';
import { IsRecord } from '@src/decorators/is-record.decorator';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class LastStepLoginDto {
  @ApiProperty({
    example: 'thePool',
    description: '입수전 마지막 단계에서 받는 닉네임',
    required: true,
    type: 'string',
  })
  @IsRecord({ model: 'member' }, false)
  @Length(1, 30)
  @IsString()
  nickname: string;

  @ApiProperty({
    example: 1,
    description: '입수전 마지막 단계에서 받는 유저 작업 분야',
    required: true,
    enum: getValueByEnum(MajorId, 'number'),
  })
  @IsEnum(MajorId)
  @IsNotEmpty()
  majorId: number;

  @ApiProperty({
    example: [1, 2, 3, 4, 5],
    description: '입수전 마지막 단계에서 받는 유저 관심분야',
    required: true,
    enum: getValueByEnum(MajorSkillId, 'number'),
  })
  @ArrayMaxSize(10)
  @IsEnum(MajorSkillId, { each: true })
  @ArrayNotEmpty()
  @IsArray()
  memberSkill: MajorSkillId[];
}
