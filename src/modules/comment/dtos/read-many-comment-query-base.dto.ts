import { IntersectionType, PickType } from '@nestjs/swagger';
import { PageDto } from '@src/dtos/page.dto';
import { SortDto } from '@src/dtos/sort.dto';

export class ReadManyCommentQueryBaseDto extends IntersectionType(
  PageDto,
  PickType(SortDto, ['orderBy']),
) {}
