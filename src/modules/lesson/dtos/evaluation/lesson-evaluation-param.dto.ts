import { ApiProperty } from '@nestjs/swagger';
import { ModelName } from '@src/constants/enum';
import { IsRecord } from '@src/decorators/is-record.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { Type } from 'class-transformer';
import { Min } from 'class-validator';

export class LessonEvaluationParamDto extends IdRequestParamDto {
  @ApiProperty({
    description: 'evaluation 고유 ID',
    type: 'number',
    required: true,
  })
  @IsRecord({ model: ModelName.LessonLevelEvaluation, field: 'id' }, true)
  @Min(1)
  @Type(() => Number)
  evaluationId: number;
}
