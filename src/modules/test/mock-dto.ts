import { MEMBER_NICKNAME_LENGTH } from '@src/constants/constant';
import { IsString, Length } from 'class-validator';
import { LastStepLoginDto } from '../member/dtos/last-step-login.dto';

export class MockLastStepLoginDto extends LastStepLoginDto {
  @IsString()
  @Length(MEMBER_NICKNAME_LENGTH.MIN, MEMBER_NICKNAME_LENGTH.MAX)
  nickname: string;
}
