import { ApiProperty } from '@nestjs/swagger';
import { ModelName } from '@src/constants/enum';
import { IsRecord } from '@src/decorators/is-record.decorator';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class FindMemberStatisticsRequestParamDto {
  @ApiProperty({
    description: 'member 고유 ID',
  })
  @IsRecord({ model: ModelName.MemberStatistics }, true)
  @Min(1)
  @IsInt()
  @Type(() => Number)
  memberId: number;
}
