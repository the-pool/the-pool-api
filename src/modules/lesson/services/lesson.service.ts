import { ForbiddenException, Injectable } from '@nestjs/common';
import { Lesson } from '@prisma/client';
import { DataStructureHelper } from '@src/helpers/data-structure.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { CreateLessonDto } from '../dtos/create-lesson.dto';
import { UpdateLessonDto } from '../dtos/update-lesson.dto';
import { LessonHashtagEntity } from '../entities/lesson-hashtag.entity';
import { LessonRepository } from '../repositories/lesson.repository';
import { ReadOneLessonResponseType } from '../types/response/read-one-lesson-response.type';

@Injectable()
export class LessonService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly dataStructureHelper: DataStructureHelper,
    private readonly lessonRepository: LessonRepository,
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
        lessonHashtags: {
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

  /**
   * 과제 수정 메서드
   */
  async updateLesson(
    lesson: Omit<UpdateLessonDto, 'hashtag'>,
    memberId: number,
    lessonId: number,
  ) {
    const updatedLesson = await this.prismaService.lesson.updateMany({
      where: { id: lessonId, memberId },
      data: { ...lesson },
    });

    if (!updatedLesson.count) {
      throw new ForbiddenException('과제를 수정할 권한이 없습니다.');
    }
  }

  /**
   * 과제 해시태그 수정 메서드
   */
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

  /**
   * 과제 상세 조회 메서드
   */
  async readOneLesson(
    lessonId: number,
    memberId: number,
  ): Promise<ReadOneLessonResponseType> {
    const [lesson, lessonLevelEvaluation, lessonHashtag] = await Promise.all([
      this.lessonRepository.readOneLesson(lessonId, memberId),
      this.lessonRepository.readLessonLevelEvaluation(lessonId),
      this.lessonRepository.readLessonHashtag(lessonId),
    ]);

    return Object.assign({}, lesson, lessonHashtag, { lessonLevelEvaluation });
  }
}
