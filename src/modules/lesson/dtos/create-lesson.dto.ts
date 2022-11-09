import { PickType } from '@nestjs/swagger';
import { LessonLevelId } from '@src/constants/enum';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
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

  @IsString()
  @IsNotEmpty()
  title: string;
}
