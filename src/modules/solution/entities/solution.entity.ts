import { ApiProperty, IntersectionType } from "@nestjs/swagger";
import { LessonSolution } from "@prisma/client";
import { DateResponseType } from "@src/types/date-response.type";
import { IdResponseType } from "@src/types/id-response-type";

export class SolutionEntity
  extends IntersectionType(IdResponseType, DateResponseType)
  implements LessonSolution {
  @ApiProperty({
    description: '유저 고유 Id'
  })
  memberId: number;

  @ApiProperty({
    description: '연관된 문제 고유 Id'
  })
  lessonId: number;

  @ApiProperty({
    description: '풀이'
  })
  description: string;

  @ApiProperty({
    description: '풀이와 관련된 링크',
    example: 'https://github.com/the-pool/the-pool-api'
  })
  relatedLink: string | null;
}