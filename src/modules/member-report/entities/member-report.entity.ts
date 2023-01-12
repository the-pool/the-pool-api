import { ApiProperty } from '@nestjs/swagger';
import { MemberReport } from '@prisma/client';
import { IdResponseType } from '@src/types/id-response-type';

export class MemberReportEntity extends IdResponseType implements MemberReport {
  @ApiProperty({
    description: 'memberId',
  })
  memberId: number;

  @ApiProperty({
    description: '과제 제출 개수',
    default: 0,
  })
  lessonCount: number;

  @ApiProperty({
    description: '피드백 개수',
    default: 0,
  })
  feedbackCount: number;

  @ApiProperty({
    description: '댓글 개수',
    default: 0,
  })
  commentCount: number;

  @ApiProperty({
    description: '팔로우 개수',
    default: 0,
  })
  followCount: number;

  @ApiProperty({
    description: '팔로잉 개수',
    default: 0,
  })
  followingCount: number;

  @ApiProperty({
    description: '랭킹 (랭킹 시스템 적용전까지 null 로 들어갑니다.)',
    nullable: true,
    default: null,
  })
  rank: number | null;

  @ApiProperty({
    description: '포인트 (포인트 시스템 적용전까지 0 으로 들어갑니다.)',
    default: 0,
  })
  point: number;
}