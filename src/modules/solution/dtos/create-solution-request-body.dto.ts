import { isNil } from '@nestjs/common/utils/shared.utils';
import { PickType } from '@nestjs/swagger';
import { Lesson } from '@prisma/client';
import {
  LESSON_TITLE_LENGTH,
  SOLUTION_TITLE_LENGTH,
} from '@src/constants/constant';
import { IsRecord } from '@src/decorators/is-record.decorator';
import { SolutionEntity } from '@src/modules/solution/entities/solution.entity';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
  Length,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateSolutionRequestBodyDto extends PickType(SolutionEntity, [
  'lessonId',
  'description',
  'relatedLink',
  'title',
]) {
  @Length(SOLUTION_TITLE_LENGTH.MIN, SOLUTION_TITLE_LENGTH.MAX)
  @IsString()
  title: string;

  @IsRecord<Lesson>({ model: 'lesson', field: 'id' }, true)
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
