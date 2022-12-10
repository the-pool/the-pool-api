import { MEMBER_NICKNAME_LENGTH } from '@src/constants/constant';
import { LastStepLoginDto } from '@src/modules/member/dtos/last-step-login.dto';
import { IsString, Length } from 'class-validator';

export class MockLastStepLoginDto extends LastStepLoginDto {
  @IsString()
  @Length(MEMBER_NICKNAME_LENGTH.MIN, MEMBER_NICKNAME_LENGTH.MAX)
  nickname: string;
}
