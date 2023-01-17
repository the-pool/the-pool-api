import { ApiProperty } from '@nestjs/swagger';
import { Major } from '@prisma/client';
import { MajorText } from '@src/constants/enum';
import { IdResponseType } from '@src/types/id-response-type';

/**
 * 기존 MajorEntity 가 MajorSkill 을 갖고있기 떄문에 임시로 만들고 후에 기존 MajorEntity 삭제하겠습니다.
 */
export class MajorEntityV2 extends IdResponseType implements Major {
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
