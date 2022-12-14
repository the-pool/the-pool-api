import { PickType } from '@nestjs/swagger';
import { OrderBy } from '@src/constants/enum';
import { IsIn } from 'class-validator';
import { LessonDto } from './lesson.dto';

export class SimilarLessonQueryDto extends PickType(LessonDto, [
  'sortBy',
  'orderBy',
  'page',
  'pageSize',
]) {
  @IsIn(['id'])
  sortBy: string = 'id';

  orderBy: OrderBy;
}
