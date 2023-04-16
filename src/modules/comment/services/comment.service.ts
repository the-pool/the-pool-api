import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import {
  PrismaCommentModelMapper,
  PrismaCommentModelName,
  PrismaCommentParentIdColumn,
} from '@src/types/type';
import { ReadManyCommentQueryBaseDto } from '../dtos/read-many-comment-query-base.dto';
import { PrismaPromise } from '@prisma/client';

@Injectable()
export class CommentService {
  constructor(private readonly prismaService: PrismaService) {}

  createComment<T extends PrismaCommentModelName>(
    commentModel: T,
    parentIdColumn: Partial<PrismaCommentParentIdColumn>,
    memberId: number,
    description: string,
  ): Promise<PrismaCommentModelMapper[T]> {
    // @ts-ignore
    return this.prismaService[commentModel].create({
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
  }

  deleteComment<T extends PrismaCommentModelName>(
    commentModel: T,
    commentId: number,
  ): Promise<PrismaCommentModelMapper[T]> {
    // @ts-ignore
    return this.prismaService[commentModel].delete({
      where: { id: commentId },
      include: {
        member: {
          include: {
            major: true,
          },
        },
      },
    });
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
}
