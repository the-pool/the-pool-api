import { ApiProperty } from '@nestjs/swagger';
import { setObjectValuesToNumber } from '@src/common/common';
import { MemberEntity } from '@src/modules/member/entities/member.entity';
import { SOLUTION_VIRTUAL_COLUMN_FOR_READ_MANY } from '@src/modules/solution/constants/solution.const';
import { SolutionEntity } from '@src/modules/solution/entities/solution.entity';

export class ReadManySolutionEntity extends SolutionEntity {
  @ApiProperty({
    description: '문제-풀이자',
    type: MemberEntity,
    required: true,
  })
  member: MemberEntity;

  @ApiProperty({
    description: '문제-풀이의 좋아요, 댓글',
    example: setObjectValuesToNumber(
      SOLUTION_VIRTUAL_COLUMN_FOR_READ_MANY,
      1,
      100,
    ),
  })
  _count: {
    [key in keyof typeof SOLUTION_VIRTUAL_COLUMN_FOR_READ_MANY]: number;
  };
}
