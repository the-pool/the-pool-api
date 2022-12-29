import { Injectable } from '@nestjs/common';
import { Lesson } from '@prisma/client';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { LessonRepository } from '../repositories/lesson.repository';
import { LessonEntity } from '../entities/lesson.entity';
import { UpdateLessonDto } from '../dtos/update-lesson.dto';
import { SimilarLessonEntity } from '../entities/similar-lesson.entity';
import { SimilarLessonQueryDto } from '../dtos/similar-lesson.dto';
import { CreateLessonDto } from '../dtos/create-lesson.dto';
import { ReadOneLessonDto } from '../dtos/read-one-lesson.dto';

@Injectable()
export class LessonService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly lessonRepository: LessonRepository,
  ) {}

  /**
   * 과제 생성 메서드
   */
  createLesson(lesson: CreateLessonDto, memberId: number): Promise<Lesson> {
    return this.prismaService.lesson.create({
      data: {
        ...lesson,
        memberId,
      },
    });
  }

  /**
   * 과제 수정 메서드
   */
  async updateLesson(
    lesson: UpdateLessonDto,
    lessonId: number,
  ): Promise<Omit<LessonEntity, 'hashtag'>> {
    return await this.prismaService.lesson.update({
      where: { id: lessonId },
      data: { ...lesson },
    });
  }

  /**
   * 과제 삭제 메서드
   */
  async deleteLesson(lessonId: number) {
    return await this.prismaService.lesson.delete({
      where: { id: lessonId },
    });
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
