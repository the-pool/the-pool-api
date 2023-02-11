import { ApiProperty } from '@nestjs/swagger';
import { LessonHashtag } from '@prisma/client';
import { ModelName } from '@src/constants/enum';
import { IsRecord } from '@src/decorators/is-record.decorator';
import { ArrayUnique, IsArray, IsInt, Min } from 'class-validator';

export class CreateManyLessonHashtagDto {
  @ApiProperty({
    description: '생성할 hashtag의 고유 id',
    example: [1, 2, 3],
  })
  @IsRecord<LessonHashtag>(
    { model: ModelName.LessonHashtag, field: 'id' },
    true,
    { each: true },
  )
  @Min(1, { each: true })
  @IsInt({ each: true })
  @ArrayUnique()
  lessonHashtagIds: number[];
}
