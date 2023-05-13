import { PickType } from '@nestjs/swagger';
import { LESSON_TITLE_LENGTH } from '@src/constants/constant';
import { LessonCategoryId, LessonLevelId } from '@src/constants/enum';
import { LessonEntity } from '@src/modules/lesson/entities/lesson.entity';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateLessonDto extends PickType(LessonEntity, [
  'levelId',
  'description',
  'title',
  'thumbnail',
  'categoryId',
]) {
  @IsEnum(LessonLevelId)
  @IsNotEmpty()
  levelId: LessonLevelId;

  @IsEnum(LessonCategoryId)
  @IsNotEmpty()
  categoryId: LessonCategoryId;

  @IsString()
  @IsNotEmpty()
  description: string;

  @Length(LESSON_TITLE_LENGTH.MIN, LESSON_TITLE_LENGTH.MAX)
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  thumbnail: string;
}
