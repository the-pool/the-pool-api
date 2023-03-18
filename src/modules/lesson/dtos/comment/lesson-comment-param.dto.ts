import { ApiProperty } from '@nestjs/swagger';
import { LessonComment } from '@prisma/client';
import { ModelName } from '@src/constants/enum';
import { IsRecord } from '@src/decorators/is-record.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class LessonCommentParamDto extends IdRequestParamDto {
  @ApiProperty({
    description: 'lessonComment 고유 ID',
    type: 'number',
    required: true,
  })
  @IsRecord<LessonComment>(
    { model: ModelName.LessonComment, field: 'id' },
    true,
  )
  @Min(1)
  @IsInt()
  @Type(() => Number)
  commentId: number;
}
