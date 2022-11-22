import { nicknameLength } from '@src/constants/constant';
import { IsString, Length } from 'class-validator';
import { LastStepLoginDto } from '../member/dtos/last-step-login.dto';

export class MockLastStepLoginDto extends LastStepLoginDto {
  @IsString()
  @Length(nicknameLength.MIN, nicknameLength.MAX)
  nickname: string;
}
