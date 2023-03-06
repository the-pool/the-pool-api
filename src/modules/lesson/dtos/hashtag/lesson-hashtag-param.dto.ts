import { ApiProperty } from '@nestjs/swagger';
import { LessonHashtag } from '@prisma/client';
import {
  transformCsvToArray,
  transformEachStrungToNumber,
  transformEachTrim,
} from '@src/common/common';
import { ModelName } from '@src/constants/enum';
import { IsRecordMany } from '@src/decorators/is-record-many.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { Transform } from 'class-transformer';
import { ArrayUnique, IsInt, Min } from 'class-validator';

export class LessonHashtagParamDto extends IdRequestParamDto {
  @ApiProperty({
    description:
      'lessonHashtag 고유 ID</br>CSV 형태로 보내줘야합니다.</br>, 기준으로 앞뒤 공백 제거한 뒤 유효성 검사 진행합니다.',
    example: '1, 2, 3',
    minimum: 1,
    uniqueItems: true,
    type: () => String,
  })
  @IsRecordMany<LessonHashtag>(
    { model: ModelName.LessonHashtag, field: 'id' },
    true,
  )
  @Min(1, { each: true })
  @IsInt({ each: true })
  @ArrayUnique()
  @Transform(transformCsvToArray)
  @Transform(transformEachTrim)
  @Transform(transformEachStrungToNumber)
  lessonHashtagIds: number[];
}
