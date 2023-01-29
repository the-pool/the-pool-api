import { ApiProperty } from '@nestjs/swagger';
import { LessonHashtag, LessonHashtagMapping } from '@prisma/client';
import { getEntriesByEnum } from '@src/common/common';
import { LessonHashtagId, ModelName } from '@src/constants/enum';
import { IsRecord } from '@src/decorators/is-record.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class LessonHashtagParamDto extends IdRequestParamDto {
  @ApiProperty({
    description: '특정 과제의 해시태그 고유 ID',
    example: 1,
  })
  @IsRecord<LessonHashtagMapping>(
    { model: ModelName.LessonHashtagMapping, field: 'id' },
    true,
  )
  @Min(1)
  @IsInt()
  @Type(() => Number)
  lessonHashtagMappingId: number;
}
