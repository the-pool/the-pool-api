import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class CreateHashtagDto {
  @ApiProperty({
    example: ['the-pool', '백엔드', '화이팅'],
    description: '생성할 hashtag',
    required: true,
    type: [String],
  })
  @IsString({ each: true })
  @IsArray()
  hashtags: string[];
}
