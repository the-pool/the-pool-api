import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { PrismaCommentModelName, PrismaModelName } from '@src/types/type';

@Injectable()
export class CommentService {
  constructor(private readonly prismaService: PrismaService) {}

  createComment(
    commentModel: PrismaCommentModelName,
    commentColumn: Partial<Record<`${PrismaModelName}Id`, number>>,
    memberId: number,
    description: string,
  ) {
    // @ts-ignore
    return this.prismaService[commentModel].create({
      // @ts-ignore
      data: { memberId: memberId, ...commentColumn, description },
    });
  }

  deleteComment(commentModel: PrismaCommentModelName, commentId: number) {
    // @ts-ignore
    return this.prismaService[commentModel].delete({
      where: { id: commentId },
    });
  }
}
