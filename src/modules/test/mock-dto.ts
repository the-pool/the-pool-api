import { IsString } from 'class-validator';
import { LastStepLoginDto } from '../member/dtos/last-step-login.dto';

export class MockLastStepLoginDto extends LastStepLoginDto {
  @IsString()
  nickname: string;
}
