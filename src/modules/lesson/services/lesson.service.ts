import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { CreateLessonDto } from '../dtos/create-lesson.dto';
import { ReadOneLessonDto } from '../dtos/read-one-lesson.dto';
import { SimilarLessonQueryDto } from '../dtos/similar-lesson.dto';
import { UpdateLessonDto } from '../dtos/update-lesson.dto';
import { LessonEntity } from '../entities/lesson.entity';
import { SimilarLessonEntity } from '../entities/similar-lesson.entity';
import { LessonRepository } from '../repositories/lesson.repository';

@Injectable()
export class LessonService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly lessonRepository: LessonRepository,
  ) {}

  /**
   * 과제 생성 메서드
   */
  createLesson(
    lesson: CreateLessonDto,
    memberId: number,
  ): Promise<Omit<LessonEntity, 'hashtag'>> {
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
  updateLesson(
    lesson: UpdateLessonDto,
    lessonId: number,
  ): Promise<Omit<LessonEntity, 'hashtag'>> {
    return this.prismaService.lesson.update({
      where: { id: lessonId },
      data: { ...lesson },
    });
  }

  /**
   * 과제 삭제 메서드
   */
  deleteLesson(lessonId: number) {
    return this.prismaService.lesson.delete({
      where: { id: lessonId },
    });
  }

  /**
   * 과제 상세 조회 메서드
   */
  readOneLesson(lessonId: number, memberId: number): Promise<ReadOneLessonDto> {
    return this.lessonRepository.readOneLesson(lessonId, memberId);
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
