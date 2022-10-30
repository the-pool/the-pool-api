import { ApiProperty } from '@nestjs/swagger';
import { getValueByEnum } from '@src/common/common';
import { OAuthAgency } from '@src/modules/core/auth/constants/oauth.enums';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class LoginByOAuthDto {
  @ApiProperty({
    example: 'B1PQ7e14y69IdyisLn-0Mx_eDlM3H-8MEwBJuVXoCj11WgAAAYQDMBGy',
    description: 'oauth accesstoken',
    required: true,
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  accessToken: string;

  @ApiProperty({
    example: 1,
    description:
      '소셜 로그인 인증 기관의 고유 번호입니다. {kakao : 1, google : 2, apple : 3}',
    required: true,
    enum: getValueByEnum(OAuthAgency, 'number'),
    type: 'number',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsEnum(OAuthAgency)
  oAuthAgency: OAuthAgency;
}
