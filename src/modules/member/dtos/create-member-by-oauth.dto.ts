import { ApiProperty } from '@nestjs/swagger';
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
    example: '0',
    description:
      '소셜 로그인 인증 기관의 고유 번호입니다. {kakao : 0, google : 1, apple : 2}',
    required: true,
    type: 'number',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsEnum(OAuthAgency)
  oAuthAgency: OAuthAgency;
}
