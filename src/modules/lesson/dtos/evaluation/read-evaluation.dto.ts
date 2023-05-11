import { ApiProperty } from '@nestjs/swagger';
import { CountEvaluationDto } from '@src/modules/lesson/dtos/evaluation/count-evaluation.dto';
import { LessonEvaluationEntity } from '@src/modules/lesson/entities/lesson-evaluation.entity';
import { Type } from 'class-transformer';

export class ReadEvaluationDto {
  @ApiProperty({
    description: '과제의 난이도 별 count 갯수',
    type: CountEvaluationDto,
  })
  @Type(() => CountEvaluationDto)
  countedEvaluation: CountEvaluationDto;

  @ApiProperty({
    description:
      '조회 요청을 보낸 member가 생성한 체감 난이도, 비회원이거나 체감 난이도를 입력하지 않았다면 null이 return',
    type: LessonEvaluationEntity,
    nullable: true,
  })
  memberEvaluate: LessonEvaluationEntity | null;
}
