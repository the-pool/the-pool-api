import { ApiProperty } from '@nestjs/swagger';
import { LessonHashtagEntity } from '@src/modules/lesson/entities/lesson-hashtag.entity';

export class HashtagDto {
  @ApiProperty({
    description: '해시태그',
    type: LessonHashtagEntity,
  })
  hashtag: LessonHashtagEntity;
}
