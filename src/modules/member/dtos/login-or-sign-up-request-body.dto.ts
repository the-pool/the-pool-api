import { ApiProperty } from '@nestjs/swagger';
import { getEntriesByEnum, getStrMapByEnum } from '@src/common/common';
import { MemberLoginType } from '@src/modules/member/constants/member.enum';
import { IsEnum, IsString } from 'class-validator';

export class LoginOrSignUpRequestBodyDto {
  @ApiProperty({
    description: 'oauth accesstoken',
    example: 'B1PQ7e14y69IdyisLn-0Mx_eDlM3H-8MEwBJuVXoCj11WgAAAYQDMBGy',
  })
  @IsString()
  oAuthToken: string;

  @ApiProperty({
    description: 'member 의 로그인 타입' + getStrMapByEnum(MemberLoginType),
    example: 1,
    enum: getEntriesByEnum(MemberLoginType),
  })
  @IsEnum(MemberLoginType)
  loginType: MemberLoginType;
}
