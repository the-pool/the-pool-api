import { IsString, Length } from 'class-validator';
import { LastStepLoginDto } from '../member/dtos/last-step-login.dto';

export class MockLastStepLoginDto extends LastStepLoginDto {
  @IsString()
  @Length(1, 30)
  nickname: string;
}
