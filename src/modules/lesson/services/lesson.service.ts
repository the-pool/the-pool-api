import { ForbiddenException, Injectable } from '@nestjs/common';
import { Lesson } from '@prisma/client';
import { DataStructureHelper } from '@src/helpers/data-structure.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { CreateLessonDto } from '../dtos/create-lesson.dto';
import { UpdateLessonDto } from '../dtos/update-lesson.dto';
import { LessonHashtagEntity } from '../entities/lesson-hashtag.entity';
import { LessonRepository } from '../repositories/lesson.repository';
import { ReadOneLessonDto } from '../dtos/read-one-lesson.dto';
import { LessonEntity } from '../entities/lesson.entity';
import { SimilarLessonQueryDto } from '../dtos/similar-lesson.dto';
import { SimilarLessonEntity } from '../entities/similar-lesson.entity';

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
    { hashtags, ...lesson }: CreateLessonDto,
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
              tag: hashtags,
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
    lesson: Omit<UpdateLessonDto, 'hashtags'>,
    memberId: number,
    lessonId: number,
  ): Promise<LessonEntity> {
    const updatedLesson = await this.prismaService.lesson.update({
      where: { id: lessonId, memberId },
      data: { ...lesson },
    });

    if (!updatedLesson) {
      throw new ForbiddenException('과제를 수정할 권한이 없습니다.');
    }
    return updatedLesson;
  }

  /**
   * 과제 해시태그 수정 메서드
   */
  async updateLessonHashtag(hashtags: string[], lessonId: number) {
    await this.prismaService.lessonHashtag.deleteMany({
      where: {
        lessonId,
      },
    });

    const lessonIdArr = Array.from({ length: hashtags.length }, () => lessonId);

    await this.prismaService.lessonHashtag.createMany({
      data: this.dataStructureHelper.createManyMapper<
        Pick<LessonHashtagEntity, 'lessonId' | 'tag'>
      >({
        tag: hashtags,
        lessonId: lessonIdArr,
      }),
    });

    const updatedHashtags = await this.prismaService.lessonHashtag.findMany({
      where: {
        lessonId,
      },
      select: { tag: true },
    });

    return updatedHashtags.map((item) => item.tag);
  }

  /**
   * 과제 상세 조회 메서드
   */
  async readOneLesson(
    lessonId: number,
    memberId: number,
  ): Promise<ReadOneLessonDto> {
    const [lesson, lessonLevelEvaluation, lessonHashtag] = await Promise.all([
      this.lessonRepository.readOneLesson(lessonId, memberId),
      this.lessonRepository.readLessonLevelEvaluation(lessonId),
      this.lessonRepository.readLessonHashtag(lessonId),
    ]);

    return Object.assign({}, lesson, lessonHashtag, { lessonLevelEvaluation });
  }

  /**
   * 유사 과제 조회 메서드
   */
  readSimilarLesson(
    lessonId: number,
    memberId: number,
    query: SimilarLessonQueryDto,
  ): Promise<SimilarLessonEntity[]> {
    return this.lessonRepository.readSimilarLesson(lessonId, memberId, query);
  }
}
