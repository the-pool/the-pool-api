import { ApiProperty } from '@nestjs/swagger';
import { OAuthAgency } from '@src/modules/core/auth/constants/oauth.enums';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMemberByOAuthDto {
  @ApiProperty({
    example: 'asdfsdfewfsed',
    description: 'oauth accesstoken',
    required: true,
    type: 'string',
  })
  @IsString()
  accessToken: string;

  @ApiProperty({
    example: '0',
    description:
      '소셜 로그인 인증 기관의 고유 번호입니다. {kakao : 0, google : 1, apple : 2}',
    required: true,
    type: 'string',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsEnum(OAuthAgency)
  oAuthAgency: number;
}
