import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { PostEntity } from '@src/modules/post/entities/post.entity';

@Injectable()
export class PostAuthorityHelper {
  constructor(private readonly prismaService: PrismaService) {}

  checkIdentification(postId, authorId): Promise<any> {
    return this.prismaService.post.findFirst({
      where: {
        authorId,
        id: postId,
      },
    });
  }
}
