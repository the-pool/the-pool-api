import { PartialType, PickType } from "@nestjs/swagger";
import { Lesson, LessonSolution } from "@prisma/client";
import { IsRecord } from "@src/decorators/is-record.decorator";
import { IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";
import { SolutionEntity } from "../entities/solution.entity";

export class CreateSolutionRequestBodyDto extends PickType(SolutionEntity, [
  'lessonId',
  'description',
  'relatedLink'
]) {
  @IsRecord<Lesson>({ model: 'lesson', field: 'id' }, false)
  @IsNumber()
  @IsNotEmpty()
  lessonId: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  relatedLink: string;
}