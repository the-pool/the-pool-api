import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class PatchUpdatePostDto {
  @ApiProperty({
    description: '게시 여부',
    required: true,
  })
  @IsBoolean()
  published: boolean;
}
