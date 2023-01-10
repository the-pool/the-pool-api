import { IntersectionType, PartialType } from '@nestjs/swagger';
import { PageDto } from '@src/dtos/page.dto';
import { SortDto } from '@src/dtos/sort.dto';
import { LessonEntity } from '../../entities/lesson.entity';

export class LessonDto extends IntersectionType(
  PartialType(LessonEntity),
  IntersectionType(PageDto, SortDto),
) {}
