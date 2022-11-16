import { ApiProperty } from '@nestjs/swagger';
import { getEntriesByEnum } from '@src/common/common';
import { nicknameLength } from '@src/constants/constant';
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
    description: '입수전 마지막 단계에서 받는 닉네임',
    example: 'thePool',
  })
  @IsRecord({ model: 'member' }, false)
  @Length(nicknameLength.MIN, nicknameLength.MAX)
  @IsString()
  nickname: string;

  @ApiProperty({
    description: `입수전 마지막 단계에서 받는 유저 작업 분야`,
    example: 1,
    enum: getEntriesByEnum(MajorId),
  })
  @IsEnum(MajorId)
  @IsNotEmpty()
  majorId: MajorId;

  @ApiProperty({
    description: `입수전 마지막 단계에서 받는 유저 관심분야`,
    example: [1, 2, 3],
    enum: getEntriesByEnum(MajorSkillId),
  })
  @ArrayMaxSize(10)
  @IsEnum(MajorSkillId, { each: true })
  @ArrayNotEmpty()
  @IsArray()
  memberSkill: MajorSkillId[];
}
