import { Type } from "@nestjs/common";
import { PartialType, PickType } from "@nestjs/swagger";
import { DEFAULT_LIMIT_LENGTH } from "@src/constants/constant";
import { QuestionCategoryId } from "@src/constants/enum";
import { IsEnum, IsNotEmpty, isNotEmpty, IsString, Length, MinLength } from "class-validator";
import { QuestionEntity } from "../entities/question.entity";

export class CreateQuestionRequestBodyDto extends PickType(QuestionEntity, [
  'categoryId',
  'title',
  'content',
]) {
  @IsEnum(QuestionCategoryId)
  @IsNotEmpty()
  categoryId: QuestionCategoryId;

  @IsString()
  @IsNotEmpty()
  @Length(DEFAULT_LIMIT_LENGTH.MIN, DEFAULT_LIMIT_LENGTH.MAX)
  title: string;

  @IsString()
  @MinLength(DEFAULT_LIMIT_LENGTH.MIN, {
    message: 'Content is too short'
  })
  @IsNotEmpty()
  content: string;
}