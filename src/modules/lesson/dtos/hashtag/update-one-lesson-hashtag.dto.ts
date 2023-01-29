import { ApiProperty } from '@nestjs/swagger';
import { LessonHashtag } from '@prisma/client';
import { ModelName } from '@src/constants/enum';
import { IsRecord } from '@src/decorators/is-record.decorator';
import { IsInt, Min } from 'class-validator';

export class UpdateOneLessonHashtagDto {
  @ApiProperty({
    example: 'the-pool',
    description: '생성할 hashtag',
    required: true,
  })
  @IsRecord<LessonHashtag>(
    { model: ModelName.LessonHashtag, field: 'id' },
    true,
  )
  @Min(1)
  @IsInt()
  lessonHashtagId: number;
}
