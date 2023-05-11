import { ApiProperty } from '@nestjs/swagger';
import { SOLUTION_HASHTAG_LENGTH } from '@src/constants/constant';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsString,
  Length,
} from 'class-validator';

export class CreateSolutionHashtagsRequestBodyDto {
  @ApiProperty({
    description:
      'string 형식으로 보내주세요. 각 항목별 최대 길이는 15자입니다. ',
    example: ['개발', 'Web', 'React'],
    minimum: 1,
    maximum: 5,
    maxLength: 5,
    uniqueItems: true,
    type: () => [String],
  })
  @Length(SOLUTION_HASHTAG_LENGTH.MIN, SOLUTION_HASHTAG_LENGTH.MAX, {
    each: true,
  })
  @IsString({ each: true })
  @ArrayUnique()
  @ArrayMaxSize(5)
  @ArrayNotEmpty()
  @IsArray()
  hashtags: string[];
}
