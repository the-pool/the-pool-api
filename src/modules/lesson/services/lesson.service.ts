import { Injectable } from '@nestjs/common';
import { Lesson } from '@prisma/client';
import { DataStructureHelper } from '@src/helpers/data-structure.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { LessonHashtagEntity } from '../entities/lesson-hashtag.entity';
import { LessonRepository } from '../repositories/lesson.repository';
import { LessonEntity } from '../entities/lesson.entity';
import { UpdateLessonDto } from '../dtos/update-lesson.dto';
import { SimilarLessonEntity } from '../entities/similar-lesson.entity';
import { SimilarLessonQueryDto } from '../dtos/similar-lesson.dto';
import { CreateLessonDto } from '../dtos/create-lesson.dto';
import { ReadOneLessonDto } from '../dtos/read-one-lesson.dto';
import { PrismaHelper } from '@src/modules/core/database/prisma/prisma.helper';
import { ModelName } from '@src/constants/enum';

@Injectable()
export class LessonService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly prismaHelper: PrismaHelper,
    private readonly dataStructureHelper: DataStructureHelper,
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
    memberId: number,
    lessonId: number,
  ): Promise<LessonEntity> {
    await this.prismaHelper.findOneOrFail(ModelName.Lesson, {
      id: lessonId,
      memberId,
    });

    const updatedLesson = await this.prismaService.lesson.update({
      where: { id: lessonId, memberId },
      data: { ...lesson },
    });

    return updatedLesson;
  }

  /**
   * 과제 삭제 메서드
   */
  async deleteLesson(memberId: number, lessonId: number) {
    await this.prismaHelper.findOneOrFail(ModelName.Lesson, {
      id: lessonId,
      memberId,
    });

    return await this.prismaService.lesson.delete({
      where: { id: lessonId, memberId },
    });
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

    const updatedHashtag = await this.prismaService.lessonHashtag.findMany({
      where: {
        lessonId,
      },
      select: { tag: true },
    });

    return updatedHashtag.map((item) => item.tag);
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
