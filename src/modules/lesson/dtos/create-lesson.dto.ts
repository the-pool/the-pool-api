import { PickType } from '@nestjs/swagger';
import { LessonLevelId } from '@src/constants/enum';
import { IsArray, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { LessonEntity } from '../entities/lesson.entity';

export class CreateLessonDto extends PickType(LessonEntity, [
  'levelId',
  'description',
  'title',
]) {
  @IsEnum(LessonLevelId)
  @IsNotEmpty()
  levelId: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @Length(1, 50)
  @IsString()
  title: string;

  @IsString({ each: true })
  @IsArray()
  hashtag: string[];
}
