import { ForbiddenException, Injectable } from '@nestjs/common';
import { Lesson } from '@prisma/client';
import { DataStructureHelper } from '@src/helpers/data-structure.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { CreateLessonDto } from '../dtos/create-lesson.dto';
import { UpdateLessonDto } from '../dtos/update-lesson.dto';
import { LessonHashtagEntity } from '../entities/lesson-hashtag.entity';

@Injectable()
export class LessonService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly dataStructureHelper: DataStructureHelper,
  ) {}

  /**
   * 과제 생성 메서드
   */
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
            data: this.dataStructureHelper.createManyMapper<
              Pick<LessonHashtagEntity, 'tag'>
            >({
              tag: hashtag,
            }),
          },
        },
      },
    });
  }

  async updateLesson(
    lesson: Omit<UpdateLessonDto, 'hashtag'>,
    memberId: number,
    lessonId: number,
  ) {
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
      data: this.dataStructureHelper.createManyMapper<
        Pick<LessonHashtagEntity, 'lessonId' | 'tag'>
      >({
        tag: hashtag,
        lessonId: lessonIdArr,
      }),
    });
  }
}
