import { Injectable } from '@nestjs/common';
import { DataStructureHelper } from '@src/helpers/data-structure.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { LessonHashtagEntity } from '@src/modules/lesson/entities/lesson-hashtag.entity';
import { ReadLessonHashtagDto } from '../dtos/hashtag/read-many-lesson-hashtag.dto';
import { LessonHashtagMappingEntity } from '../entities/lesson-hashtag-mapping.entity';

@Injectable()
export class LessonHashtagService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly dataStructureHelper: DataStructureHelper,
  ) {}

  async createManyHashtag(
    lessonhashtagIds: number[],
    lessonId: number,
  ): Promise<ReadLessonHashtagDto[]> {
    const lessonIds = Array.from(
      { length: lessonhashtagIds.length },
      () => lessonId,
    );
    const settledLessonHashtags = this.dataStructureHelper.createManyMapper<
      Pick<LessonHashtagMappingEntity, 'lessonId' | 'lessonHashtagId'>
    >({
      lessonHashtagId: lessonhashtagIds,
      lessonId: lessonIds,
    });

    await this.prismaService.lessonHashtagMapping.createMany({
      data: settledLessonHashtags,
    });

    return this.readManyHashtag(lessonId);
  }

  // updateOneHashtag(hashtagId: number, hashtag: string) {
  //   return this.prismaService.lessonHashtag.update({
  //     where: { id: hashtagId },
  //     data: { tag: hashtag },
  //   });
  // }

  async updateManyHashtag(
    lessonHashtagIds: number[],
    lessonId: number,
  ): Promise<ReadLessonHashtagDto[]> {
    await this.deleteManyHashtag(lessonId);

    return this.createManyHashtag(lessonHashtagIds, lessonId);
  }

  // deleteOneHashtag(hashtagId: number): Promise<LessonHashtagEntity> {
  //   return this.prismaService.lessonHashtag.delete({
  //     where: {
  //       id: hashtagId,
  //     },
  //   });
  // }

  deleteManyHashtag(lessonId: number): Promise<{ count: number }> {
    return this.prismaService.lessonHashtagMapping.deleteMany({
      where: {
        lessonId,
      },
    });
  }

  // readOneHashtag(hashtagId: number): Promise<LessonHashtagEntity | null> {
  //   return this.prismaService.lessonHashtag.findUnique({
  //     where: {
  //       id: hashtagId,
  //     },
  //   });
  // }

  readManyHashtag(lessonId: number): Promise<ReadLessonHashtagDto[]> {
    return this.prismaService.lessonHashtagMapping.findMany({
      where: {
        lessonId,
      },
      select: {
        id: true,
        createdAt: true,
        lessonId: true,
        lessonHashtag: true,
      },
    });
  }
}
