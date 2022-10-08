import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IdResponseType } from '@src/types/id-response-type';
import { DateResponseType } from '@src/types/date-response.type';
import { Post as PostModel } from '@prisma/client';

export class PostEntity
  extends IntersectionType(IdResponseType, DateResponseType)
  implements PostModel
{
  @ApiProperty({
    description: '게시 여부',
    required: true,
    default: false,
  })
  published: boolean;

  @ApiProperty({
    description: 'title',
    required: true,
  })
  title: string;

  @ApiProperty({
    description: 'description',
    required: false,
    default: null,
  })
  description: string;

  @ApiProperty({
    description: '게시한 유저 고유 id',
    required: true,
  })
  authorId: number;
}
