import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { DateResponseType } from '@src/types/date-response.type';
import { IdResponseType } from '@src/types/id-response-type';

export class CommentEntity extends IntersectionType(
  IdResponseType,
  DateResponseType,
) {
  @ApiProperty({
    description: '특정 도메인 게시글에 달린 댓글',
    example: '댓글입니다.',
  })
  description: string;

  @ApiProperty({
    description: '댓글을 작성한 멤버 고유 ID',
    example: 1,
  })
  memberId: number;
}
