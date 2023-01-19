import { ApiProperty } from '@nestjs/swagger';
import { LessonLevelEvaluation } from '@prisma/client';
import { ModelName } from '@src/constants/enum';
import { IsRecord } from '@src/decorators/is-record.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class LessonEvaluationParamDto extends IdRequestParamDto {
  @ApiProperty({
    description: 'evaluation 고유 ID',
    type: 'number',
    required: true,
  })
  @IsRecord<LessonLevelEvaluation>(
    { model: ModelName.LessonLevelEvaluation, field: 'id' },
    true,
  )
  @Min(1)
  @IsInt()
  @Type(() => Number)
  evaluationId: number;
}
