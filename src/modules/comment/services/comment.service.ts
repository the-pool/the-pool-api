import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { PrismaCommentModelName, PrismaModelName } from '@src/types/type';

@Injectable()
export class CommentService {
  constructor(private readonly prismaService: PrismaService) {}

  createComment(
    commentModel: PrismaCommentModelName,
    parentIdColumn: Partial<Record<`${PrismaModelName}Id`, number>>,
    memberId: number,
    description: string,
  ) {
    // @ts-ignore
    return this.prismaService[commentModel].create({
      // @ts-ignore
      data: { memberId, ...parentIdColumn, description },
    });
  }
}
