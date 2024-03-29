import { ApiProperty } from '@nestjs/swagger';
import { LessonSolutionComment } from '@prisma/client';
import { ModelName } from '@src/constants/enum';
import { IsRecord } from '@src/decorators/is-record.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class SolutionCommentParamDto extends IdRequestParamDto {
  @ApiProperty({
    description: 'solutionComment 고유 ID',
    type: 'number',
    required: true,
  })
  @IsRecord<LessonSolutionComment>(
    { model: ModelName.LessonSolutionComment, field: 'id' },
    true,
  )
  @Min(1)
  @IsInt()
  @Type(() => Number)
  commentId: number;
}
