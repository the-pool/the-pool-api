import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { IsNotEmptyString } from '@src/decorators/is-not-empty-string.decorator';

export class PutUpdatePostDto {
  @ApiProperty({
    description: 'title',
    required: true,
  })
  @MaxLength(255)
  @IsNotEmptyString('title')
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'description',
    required: false,
    default: null,
  })
  @IsOptional()
  @IsNotEmptyString('description')
  description: string | null = null;
}
