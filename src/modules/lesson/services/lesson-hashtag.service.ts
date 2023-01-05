import { Injectable } from '@nestjs/common';
import { PrismaPromise } from '@prisma/client';
import { DataStructureHelper } from '@src/helpers/data-structure.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { LessonHashtagEntity } from '@src/modules/lesson/entities/lesson-hashtag.entity';

@Injectable()
export class LessonHashtagService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly dataStructureHelper: DataStructureHelper,
  ) {}

  async createManyHashtag(
    hashtags: string[],
    lessonId: number,
  ): Promise<LessonHashtagEntity[]> {
    const lessonIdArr = Array.from({ length: hashtags.length }, () => lessonId);

    await this.prismaService.lessonHashtag.createMany({
      data: this.dataStructureHelper.createManyMapper<
        Pick<LessonHashtagEntity, 'lessonId' | 'tag'>
      >({
        tag: hashtags,
        lessonId: lessonIdArr,
      }),
    });

    return this.readManyHashtag(lessonId);
  }

  updateOneHashtag(hashtagId: number, hashtag: string) {
    return this.prismaService.lessonHashtag.update({
      where: { id: hashtagId },
      data: { tag: hashtag },
    });
  }

  async updateManyHashtag(
    hashtags: string[],
    lessonId: number,
  ): Promise<LessonHashtagEntity[]> {
    await this.deleteManyHashtag(lessonId);

    return this.createManyHashtag(hashtags, lessonId);
  }

  deleteOneHashtag(hashtagId: number): Promise<LessonHashtagEntity> {
    return this.prismaService.lessonHashtag.delete({
      where: {
        id: hashtagId,
      },
    });
  }

  deleteManyHashtag(lessonId: number): PrismaPromise<{ count: number }> {
    return this.prismaService.lessonHashtag.deleteMany({
      where: {
        lessonId,
      },
    });
  }

  readOneHashtag(hashtagId: number): Promise<LessonHashtagEntity | null> {
    return this.prismaService.lessonHashtag.findUnique({
      where: {
        id: hashtagId,
      },
    });
  }

  readManyHashtag(lessonId: number): Promise<LessonHashtagEntity[]> {
    return this.prismaService.lessonHashtag.findMany({
      where: {
        lessonId,
      },
    });
  }
}
