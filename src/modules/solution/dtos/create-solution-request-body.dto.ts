import { isNil } from '@nestjs/common/utils/shared.utils';
import { PartialType, PickType } from '@nestjs/swagger';
import { Lesson, LessonSolution } from '@prisma/client';
import { IsRecord } from '@src/decorators/is-record.decorator';
import {
  IsDataURI,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { SolutionEntity } from '../entities/solution.entity';

export class CreateSolutionRequestBodyDto extends PickType(SolutionEntity, [
  'lessonId',
  'description',
  'relatedLink',
]) {
  @IsRecord<Lesson>({ model: 'lesson', field: 'id' }, false)
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  lessonId: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUrl({ require_protocol: true, require_valid_protocol: true })
  @IsString()
  @ValidateIf((a) => !isNil(a.relatedLink))
  relatedLink: string | null = null;
}
