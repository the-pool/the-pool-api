import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { MemberSocialLink } from '@prisma/client';
import { DateResponseType } from '@src/types/date-response.type';
import { IdResponseType } from '@src/types/id-response-type';

export class MemberSocialLinkEntity
  extends IntersectionType(IdResponseType, DateResponseType)
  implements MemberSocialLink
{
  @ApiProperty({
    example: 'https://github.com',
    description: 'sns 기본 주소',
  })
  socialDomain: string;

  @ApiProperty({
    example: 'github',
    description: 'sns 이름',
  })
  name: string;

  @ApiProperty({
    example: '~~~/icon.svg',
    description: '저장소의 icon path',
  })
  iconPath: string;

  @ApiProperty({
    example: 'https://~~~/icon.svg',
    description: 'icon 을 조회할 수 있는 url',
  })
  iconUrl: string;
}
