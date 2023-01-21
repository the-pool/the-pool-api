import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class FindMemberInterestListQueryDto {
  @ApiPropertyOptional({
    description: 'memberId',
    minimum: 1,
  })
  @Min(1)
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  memberId?: number;
}
