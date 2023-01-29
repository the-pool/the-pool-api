import { ApiProperty, OmitType } from '@nestjs/swagger';
import { LessonHashtagMappingEntity } from '../../entities/lesson-hashtag-mapping.entity';
import { LessonHashtagEntity } from '../../entities/lesson-hashtag.entity';

export class ReadManyLessonHashtagDto extends OmitType(
  LessonHashtagMappingEntity,
  ['lessonHashtagId'],
) {
  @ApiProperty({
    description: '과제의 해시태그',
    type: LessonHashtagEntity,
  })
  lessonHashtag: LessonHashtagEntity;
}
