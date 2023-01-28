import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateOneLessonHashtagDto {
  @ApiProperty({
    example: 'the-pool',
    description: '생성할 hashtag',
    required: true,
  })
  @IsString()
  hashtag: string;
}
