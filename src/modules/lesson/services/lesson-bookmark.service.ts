import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { LessonBookmarkEntity } from '../entities/lesson-bookmark.entity';

@Injectable()
export class LessonBookmarkService {
  constructor(private readonly prismaService: PrismaService) {}

  createBookmark(
    lessonId: number,
    memberId: number,
  ): Promise<LessonBookmarkEntity> {
    return this.prismaService.lessonBookmark.create({
      data: {
        lessonId,
        memberId,
      },
    });
  }

  deleteBookmark(
    lessonId: number,
    memberId: number,
  ): Promise<LessonBookmarkEntity> {
    return this.prismaService.lessonBookmark.delete({
      where: {
        lessonId_memberId: { lessonId, memberId },
      },
    });
  }
}
