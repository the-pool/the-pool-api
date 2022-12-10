import { PickType } from '@nestjs/swagger';
import { QuestionCategoryId } from '@src/constants/enum';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { QuestionEntity } from '../entities/question.entity';

export class QuestionDto extends PickType(QuestionEntity, [
  'categoryId',
  'title',
  'content',
]) {
  @IsEnum(QuestionCategoryId)
  @IsNotEmpty()
  categoryId: QuestionCategoryId;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}