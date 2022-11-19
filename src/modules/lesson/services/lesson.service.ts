import { ForbiddenException, Injectable } from '@nestjs/common';
import { Lesson } from '@prisma/client';
import { DataStructureHelper } from '@src/helpers/data-structure.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { CreateLessonDto } from '../dtos/create-lesson.dto';

@Injectable()
export class LessonService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly dataStructureHelper: DataStructureHelper,
  ) {}

  createLesson(
    { hashtag, ...lesson }: CreateLessonDto,
    memberId: number,
  ): Promise<Lesson> {
    return this.prismaService.lesson.create({
      data: {
        ...lesson,
        memberId,
        LessonHashtag: {
          createMany: {
            data: this.dataStructureHelper.createManyMapper<{ tag: string }>({
              tag: hashtag,
            }),
          },
        },
      },
    });
  }

  async updateLesson(lesson, memberId: number, lessonId: number) {
    const updatedCount = await this.prismaService.lesson.updateMany({
      where: { id: lessonId, memberId },
      data: { ...lesson },
    });

    if (!updatedCount.count)
      throw new ForbiddenException('과제를 삭제할 권한이 없습니다.');
  }

  async updateLessonHashtag(hashtag: string[], lessonId: number) {
    await this.prismaService.lessonHashtag.deleteMany({
      where: {
        lessonId,
      },
    });

    const lessonIdArr = Array.from({ length: hashtag.length }, () => lessonId);

    await this.prismaService.lessonHashtag.createMany({
      data: this.dataStructureHelper.createManyMapper<{
        tag: string;
        lessonId: number;
      }>({
        tag: hashtag,
        lessonId: lessonIdArr,
      }),
    });
  }
}
