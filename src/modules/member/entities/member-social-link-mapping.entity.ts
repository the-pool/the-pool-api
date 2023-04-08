import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { MemberSocialLinkMapping } from '@prisma/client';
import { DateResponseType } from '@src/types/date-response.type';
import { IdResponseType } from '@src/types/id-response-type';

export class MemberSocialLinkMappingEntity
  extends IntersectionType(
    IdResponseType,
    PickType(DateResponseType, ['createdAt']),
  )
  implements MemberSocialLinkMapping
{
  @ApiProperty({
    description: 'member 고유 ID',
    minimum: 1,
  })
  memberId: number;

  @ApiProperty({
    description: 'memberSocialLink 고유 ID',
    minimum: 1,
  })
  memberSocialLinkId: number;

  @ApiProperty({
    description: 'member 의 소셜 링크 url',
    example: 'https://github.com/1asd',
  })
  url: string;
}
