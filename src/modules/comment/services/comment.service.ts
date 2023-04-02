import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import {
  PrismaCommentModelMapper,
  PrismaCommentModelName,
  PrismaCommentParentIdColumn,
} from '@src/types/type';
import { ReadManyCommentQueryBaseDto } from '../dtos/read-many-comment-query-base.dto';

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
    });
  }

  deleteComment<T extends PrismaCommentModelName>(
    commentModel: T,
    commentId: number,
  ): Promise<PrismaCommentModelMapper[T]> {
    // @ts-ignore
    return this.prismaService[commentModel].delete({
      where: { id: commentId },
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
    });
  }

  readManyComment<T extends PrismaCommentModelName>(
    commentModel: T,
    parentIdColumn: Partial<PrismaCommentParentIdColumn>,
    query: ReadManyCommentQueryBaseDto,
  ): Promise<PrismaCommentModelMapper[T][]> {
    const { page, pageSize, orderBy } = query;
    // @ts-ignore
    return this.prismaService[commentModel].findMany({
      where: parentIdColumn,
      orderBy: { id: orderBy },
      skip: page * pageSize,
      take: pageSize,
    });
  }
}
