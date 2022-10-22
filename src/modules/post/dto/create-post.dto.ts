import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: '게시 여부',
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  published: boolean;

  @ApiProperty({
    example: 'title',
    description: 'title',
    required: true,
    type: 'string',
    maxLength: 255,
  })
  @MaxLength(255)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'description',
    description: 'description',
    required: false,
    type: 'string',
  })
  @IsOptional()
  description: string;
}
