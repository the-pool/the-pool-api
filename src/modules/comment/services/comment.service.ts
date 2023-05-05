import { Injectable } from '@nestjs/common';
import { Prisma, PrismaPromise } from '@prisma/client';
import { ReadManyCommentQueryBaseDto } from '@src/modules/comment/dtos/read-many-comment-query-base.dto';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MemberStatisticsEvent } from '@src/modules/member-statistics/events/member-statistics.event';
import {
  PrismaCommentModelMapper,
  PrismaCommentModelName,
  PrismaCommentParentIdColumn,
} from '@src/types/type';

@Injectable()
export class CommentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly memberStatisticsEvent: MemberStatisticsEvent,
  ) {}

  async createComment<T extends PrismaCommentModelName>(
    commentModel: T,
    parentIdColumn: Partial<PrismaCommentParentIdColumn>,
    memberId: number,
    description: string,
  ): Promise<PrismaCommentModelMapper[T]> {
    // @ts-ignore
    const newComment = await this.prismaService[commentModel].create({
      // @ts-ignore
      data: { memberId, ...parentIdColumn, description },
      include: {
        member: {
          include: {
            major: true,
          },
        },
      },
    });

    // member 의 lessonCommentCount 증가 이벤트 등록
    this.memberStatisticsEvent.register(memberId, {
      fieldName: this.getMemberStatisticsFieldName(commentModel),
      action: 'increment',
    });

    return newComment;
  }

  async deleteComment<T extends PrismaCommentModelName>(
    memberId: number,
    commentModel: T,
    commentId: number,
  ): Promise<PrismaCommentModelMapper[T]> {
    // @ts-ignore
    const deletedComment = await this.prismaService[commentModel].delete({
      where: { id: commentId },
      include: {
        member: {
          include: {
            major: true,
          },
        },
      },
    });

    // member 의 lessonComment 감소 이벤트 등록
    this.memberStatisticsEvent.register(memberId, {
      fieldName: this.getMemberStatisticsFieldName(commentModel),
      action: 'decrement',
    });

    return deletedComment;
  }

  updateComment<T extends PrismaCommentModelName>(
    commentModel: T,
    commentId: number,
    description: string,
  ): Promise<PrismaCommentModelMapper[T]> {
    // @ts-ignore
    return this.prismaService[commentModel].update({
      where: {
        id: commentId,
      },
      data: {
        description,
      },
      include: {
        member: {
          include: {
            major: true,
          },
        },
      },
    });
  }

  async readManyComment<T extends PrismaCommentModelName>(
    commentModel: T,
    parentIdColumn: Partial<PrismaCommentParentIdColumn>,
    query: ReadManyCommentQueryBaseDto,
  ): Promise<{ comments: PrismaCommentModelMapper[T][]; totalCount: number }> {
    const { page, pageSize, orderBy } = query;

    const readManyCommentQuery: PrismaPromise<PrismaCommentModelMapper[T][]> =
      // @ts-ignore
      this.prismaService[commentModel].findMany({
        include: {
          member: {
            include: { major: true },
          },
        },
        where: parentIdColumn,
        orderBy: { id: orderBy },
        skip: page * pageSize,
        take: pageSize,
      });

    const totalCountQuery: PrismaPromise<number> =
      // @ts-ignore
      this.prismaService[commentModel].count({
        where: parentIdColumn,
        orderBy: { id: orderBy },
      });

    const [comments, totalCount] = await this.prismaService.$transaction([
      readManyCommentQuery,
      totalCountQuery,
    ]);

    return { comments, totalCount };
  }

  private getMemberStatisticsFieldName<T extends PrismaCommentModelName>(
    commentModel: T,
  ): keyof Pick<
    Prisma.MemberStatisticsUpdateInput,
    'lessonCommentCount' | 'solutionCommentCount'
  > {
    if (commentModel === 'lessonComment') {
      return 'lessonCommentCount';
    }

    return 'solutionCommentCount';
  }
}
