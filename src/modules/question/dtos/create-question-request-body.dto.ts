import { PickType } from "@nestjs/swagger";
import { QuestionCategoryId } from "@src/constants/enum";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, isNumber, IsOptional, isString, IsString, ValidateNested } from "class-validator";
import { QuestionHashtagEntity } from "../entities/question-hashtag.entity";
import { QuestionEntity } from "../entities/question.entity";


export class CreateQuestionRequestBodyDto extends PickType(QuestionEntity, [
  'categoryId',
  'title',
  'content',
  'hit',
  'hashtag',
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

  @IsNumber()
  hit: number;

  @ValidateNested({ each: true })
  @IsOptional()
  @IsArray()
  hashtag?: QuestionHashtagEntity[];
}