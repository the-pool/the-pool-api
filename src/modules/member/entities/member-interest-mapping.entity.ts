import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { MemberInterestMapping } from '@prisma/client';
import { DateResponseType } from '@src/types/date-response.type';
import { IdResponseType } from '@src/types/id-response-type';

export class MemberInterestMappingEntity
  extends IntersectionType(
    IdResponseType,
    PickType(DateResponseType, ['createdAt']),
  )
  implements MemberInterestMapping
{
  @ApiProperty({
    description: 'member 고유 ID',
    minimum: 1,
  })
  memberId: number;

  @ApiProperty({
    description: 'majorSkill 고유 ID',
    minimum: 1,
  })
  memberInterestId: number;
}
