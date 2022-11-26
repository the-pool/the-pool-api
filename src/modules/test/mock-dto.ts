import { LESSON_TITLE_LENGTH } from '@src/constants/constant';
import { IsString, Length } from 'class-validator';
import { LastStepLoginDto } from '../member/dtos/last-step-login.dto';

export class MockLastStepLoginDto extends LastStepLoginDto {
  @IsString()
  @Length(LESSON_TITLE_LENGTH.MIN, LESSON_TITLE_LENGTH.MAX)
  nickname: string;
}
