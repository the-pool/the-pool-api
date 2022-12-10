import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SimilarLessonEntity } from '../entities/similar-lesson.entity';

export class ReadSimilarLessonDto {
  @ApiProperty({
    description: '과제의 유사 과제',
    type: [SimilarLessonEntity],
  })
  @Type(() => SimilarLessonEntity)
  lessons: SimilarLessonEntity[];
}
