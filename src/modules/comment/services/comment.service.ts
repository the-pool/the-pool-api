import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import {
  PrismaCommentModelName,
  PrismaCommentParentIdColumn,
} from '@src/types/type';

@Injectable()
export class CommentService {
  constructor(private readonly prismaService: PrismaService) {}

  createComment(
    commentModel: PrismaCommentModelName,
    parentIdColumn: Partial<PrismaCommentParentIdColumn>,
    memberId: number,
    description: string,
  ) {
    // @ts-ignore
    return this.prismaService[commentModel].create({
      // @ts-ignore
      data: { memberId, ...parentIdColumn, description },
    });
  }

  deleteComment(commentModel: PrismaCommentModelName, commentId: number) {
    // @ts-ignore
    return this.prismaService[commentModel].delete({
      where: { id: commentId },
    });
  }

  updateComment(
    commentModel: PrismaCommentModelName,
    commentId: number,
    description: string,
  ) {
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
}
