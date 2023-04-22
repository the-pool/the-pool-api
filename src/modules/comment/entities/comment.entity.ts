import { ApiProperty, IntersectionType, getSchemaPath } from '@nestjs/swagger';
import { MajorEntityV2 } from '@src/modules/major/entities/major.entity.v2';
import { MemberEntity } from '@src/modules/member/entities/member.entity';
import { DateResponseType } from '@src/types/date-response.type';
import { IdResponseType } from '@src/types/id-response-type';

export class CommentBaseEntity extends IntersectionType(
  IdResponseType,
  DateResponseType,
) {
  // 댓글 길이에 관한 정책이 정해지면 Length 속성이 추가되야 함
  @ApiProperty({
    description: '특정 도메인 게시글에 달린 댓글',
    example: '댓글입니다.',
    maxLength: 500,
  })
  description: string;

  @ApiProperty({
    description: '댓글을 작성한 멤버 고유 ID',
    example: 1,
  })
  memberId: number;

  @ApiProperty({
    description: '댓글을 작성한 멤버의 엔티티',
    allOf: [
      {
        $ref: getSchemaPath(MemberEntity),
        properties: {
          major: {
            $ref: getSchemaPath(MajorEntityV2),
          },
        },
      },
    ],
  })
  member: MemberEntity & { major: MajorEntityV2 };
}
