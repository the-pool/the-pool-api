import { ForbiddenException, Injectable } from '@nestjs/common';
import { Lesson } from '@prisma/client';
import { DataStructureHelper } from '@src/helpers/data-structure.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { CreateLessonDto } from '../dtos/create-lesson.dto';
import { UpdateLessonDto } from '../dtos/update-lesson.dto';
import { LessonHashtagEntity } from '../entities/lesson-hashtag.entity';
import { LessonRepository } from '../repositories/lesson.repository';
import { LessonEntity } from '../entities/lesson.entity';
import { NewUpdateLessonDto } from '../dtos/new-update-lesson.dto';
import { SimilarLessonEntity } from '../entities/similar-lesson.entity';
import { SimilarLessonQueryDto } from '../dtos/similar-lesson.dto';
import { NewCreateLessonDto } from '../dtos/new-create-lesson.dto';
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
  newCreateLesson(
    lesson: NewCreateLessonDto,
    memberId: number,
  ): Promise<Lesson> {
    return this.prismaService.lesson.create({
      data: {
        ...lesson,
        memberId,
      },
    });
  }

  async newUpdateLesson(
    lesson: NewUpdateLessonDto,
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

  async newDeleteLesson(memberId: number, lessonId: number) {
    await this.prismaHelper.findOneOrFail(ModelName.Lesson, {
      id: lessonId,
      memberId,
    });

    return await this.prismaService.lesson.delete({
      where: { id: lessonId, memberId },
    });
  }
}
