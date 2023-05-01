import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { Major } from '@prisma/client';
import { MajorText } from '@src/constants/enum';
import { DateResponseType } from '@src/types/date-response.type';
import { IdResponseType } from '@src/types/id-response-type';

export class MajorEntity
  extends IntersectionType(
    IdResponseType,
    PickType(DateResponseType, ['createdAt']),
  )
  implements Major
{
  @ApiProperty({
    description: '분야 명',
    enum: MajorText,
  })
  name: MajorText | string;

  @ApiProperty({
    example: '2022-10-03T09:54:50.563Z',
    description: '생성일자',
  })
  createdAt: Date;
}
