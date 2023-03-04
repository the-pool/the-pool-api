import { PartialType, PickType } from "@nestjs/swagger";
import { Lesson, LessonSolution } from "@prisma/client";
import { IsRecord } from "@src/decorators/is-record.decorator";
import { IsDataURI, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, MinLength } from "class-validator";
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
  @IsUrl({ require_protocol: true, require_valid_protocol: true })
  relatedLink: string;
}