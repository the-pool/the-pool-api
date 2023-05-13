import { ApiProperty } from '@nestjs/swagger';
import { MemberEntity } from '@src/modules/member/entities/member.entity';
import { SolutionLikeEntity } from '@src/modules/solution/entities/solution-like.entity';
import { SolutionEntity } from '@src/modules/solution/entities/solution.entity';
import { Exclude, Expose } from 'class-transformer';

export class ReadOneSolutionEntity extends SolutionEntity {
  @Exclude()
  memberId: number;

  @ApiProperty({
    description: '문제-풀이 정보',
    type: MemberEntity,
    required: true,
  })
  member: MemberEntity;
  @Exclude({ toPlainOnly: true })
  lessonSolutionLikes?: SolutionLikeEntity[] | null;

  @ApiProperty({
    example: true,
    description: '문제-풀이 좋아요 여부',
  })
  @Expose()
  get isLike(): boolean {
    return !!this.lessonSolutionLikes?.length;
  }
}
