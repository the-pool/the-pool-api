import { ApiProperty, PickType } from '@nestjs/swagger';
import { SolutionEntity } from './solution.entity';
import { Exclude, Expose } from 'class-transformer';
import { MemberEntity } from '@src/modules/member/entities/member.entity';
import { SolutionCommentEntity } from './solution-comment.entity';
import { SolutionHashtagMappingEntity } from './solution-hashtag-mapping.entity';
import { SolutionLikeEntity } from './solution-like.entity';
import { SolutionHashtagEntity } from './solution-hashtag.entity';

export class ReadOneSolutionEntity extends SolutionEntity {
  @Exclude()
  memberId: number;

  @ApiProperty({
    description: '문제-풀이 정보',
    type: MemberEntity,
    required: true,
  })
  member: MemberEntity;

  @ApiProperty({
    example: true,
    description: '문제-풀이 좋아요 여부',
  })
  @Expose()
  get isLike(): boolean {
    return !!this.lessonSolutionLikes?.length;
  }

  @Exclude({ toPlainOnly: true })
  lessonSolutionLikes?: SolutionLikeEntity[] | null;
}
