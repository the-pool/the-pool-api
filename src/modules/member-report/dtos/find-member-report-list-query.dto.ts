import { IntersectionType } from '@nestjs/swagger';
import { PageDto } from '@src/dtos/page.dto';
import { SortDto } from '@src/dtos/sort.dto';

export class FindMemberReportListQueryDto extends IntersectionType(
  PageDto,
  SortDto,
) {}
