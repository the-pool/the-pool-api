import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { LessonLikeEntity } from '@src/modules/lesson/entities/lesson-like.entity';

@Injectable()
export class LessonLikeService {
  constructor(private readonly prismaService: PrismaService) {}

  createLike(lessonId: number, memberId: number): Promise<LessonLikeEntity> {
    return this.prismaService.lessonLike.create({
      data: {
        lessonId,
        memberId,
      },
    });
  }

  deleteLike(lessonId: number, memberId: number): Promise<LessonLikeEntity> {
    return this.prismaService.lessonLike.delete({
      where: {
        lessonId_memberId: { lessonId, memberId },
      },
    });
  }
}
