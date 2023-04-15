import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class LessonSolutionStatisticsResponseBodyDto {
  @Exclude()
  total_day: bigint;

  @Exclude()
  specific_month_day: bigint;

  @Exclude()
  total_count: bigint;

  @Exclude()
  specific_month_count: bigint;

  constructor(partial?: Partial<LessonSolutionStatisticsResponseBodyDto>) {
    Object.assign(this, partial || {});
  }

  @ApiProperty({
    description: '멤버의 풀이를 한 전체 일',
    minimum: 0,
  })
  @Expose()
  get totalDay(): number {
    return Number(this.total_day);
  }

  @Expose()
  @ApiProperty({
    description: '멤버의 이번달 풀이를 한 일',
    minimum: 0,
  })
  get specificMonthDay(): number {
    return Number(this.specific_month_day);
  }
  @ApiProperty({
    description: '멤버의 전체 풀이 개수',
    minimum: 0,
  })
  @Expose()
  get totalCount(): number {
    return Number(this.total_count);
  }
  @ApiProperty({
    description: '멤버의 이번달 풀이 개수',
    minimum: 0,
  })
  @Expose()
  get specificMonthCount(): number {
    return Number(this.specific_month_count);
  }
}
