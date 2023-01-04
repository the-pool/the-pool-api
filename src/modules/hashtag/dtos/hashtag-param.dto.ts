import { ApiProperty } from '@nestjs/swagger';
import { ModelName } from '@src/constants/enum';
import { IsRecord } from '@src/decorators/is-record.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, Min } from 'class-validator';

export class LessonHashtagParamDto extends IdRequestParamDto {
  @ApiProperty({
    description: 'hashtag 고유 ID',
    type: 'number',
    required: true,
  })
  @IsRecord({ model: ModelName.LessonHashtag, field: 'id' }, true)
  @Min(1)
  @IsInt()
  @Type(() => Number)
  hashtagId: number;
}
