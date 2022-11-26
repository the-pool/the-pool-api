import { ApiProperty, PickType } from '@nestjs/swagger';
import { MEMBER_NICKNAME_LENGTH } from '@src/constants/constant';
import { LessonLevelId } from '@src/constants/enum';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { LessonEntity } from '../entities/lesson.entity';

export class CreateLessonDto extends PickType(LessonEntity, [
  'levelId',
  'description',
  'title',
  'thumbnail',
]) {
  @IsEnum(LessonLevelId)
  @IsNotEmpty()
  levelId: LessonLevelId;

  @IsString()
  @IsNotEmpty()
  description: string;

  @Length(MEMBER_NICKNAME_LENGTH.MIN, MEMBER_NICKNAME_LENGTH.MAX)
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  thumbnail: string;

  @ApiProperty({
    example: ['the-pool', '백엔드', '화이팅'],
    description: 'Lesson 생성시 생성한 hashtag',
    required: true,
    type: [String],
  })
  @IsString({ each: true })
  @IsArray()
  hashtag: string[];
}
