import { ApiProperty } from '@nestjs/swagger';
import { getEntriesByEnum } from '@src/common/common';
import { IsEnum, IsString } from 'class-validator';
import { MemberLoginType } from '../constants/member.enum';

export class LoginOrSignUpRequestBodyDto {
  @ApiProperty({
    description: 'oauth accesstoken',
    example: 'B1PQ7e14y69IdyisLn-0Mx_eDlM3H-8MEwBJuVXoCj11WgAAAYQDMBGy',
  })
  @IsString()
  accessToken: string;

  @ApiProperty({
    description: 'member 의 로그인 타입',
    example: 1,
    enum: getEntriesByEnum(MemberLoginType),
  })
  @IsEnum(MemberLoginType)
  loginType: MemberLoginType;
}
