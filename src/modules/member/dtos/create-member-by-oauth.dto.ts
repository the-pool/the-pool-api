import { ApiProperty } from '@nestjs/swagger';
import { getEntriesByEnum } from '@src/common/common';
import { OAuthAgency } from '@src/modules/core/auth/constants/oauth.enums';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class LoginByOAuthDto {
  @ApiProperty({
    description: 'oauth accesstoken',
    example: 'B1PQ7e14y69IdyisLn-0Mx_eDlM3H-8MEwBJuVXoCj11WgAAAYQDMBGy',
  })
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty({
    description: `소셜 로그인 인증 기관의 고유 번호입니다.`,
    example: 1,
    enum: getEntriesByEnum(OAuthAgency),
  })
  @IsEnum(OAuthAgency)
  @IsNotEmpty()
  oAuthAgency: OAuthAgency;
}
