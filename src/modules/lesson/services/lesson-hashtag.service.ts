import { Injectable } from '@nestjs/common';
import { DataStructureHelper } from '@src/helpers/data-structure.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { LessonHashtagEntity } from '@src/modules/lesson/entities/lesson-hashtag.entity';

@Injectable()
export class LessonHashtagService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly dataStructureHelper: DataStructureHelper,
  ) {}

  async createHashtag(
    hashtags: string[],
    lessonId: number,
  ): Promise<{ id: number; name: string }[]> {
    const lessonIdArr = Array.from({ length: hashtags.length }, () => lessonId);

    await this.prismaService.lessonHashtag.createMany({
      data: this.dataStructureHelper.createManyMapper<
        Pick<LessonHashtagEntity, 'lessonId' | 'tag'>
      >({
        tag: hashtags,
        lessonId: lessonIdArr,
      }),
    });

    const createdLessonHashtags =
      await this.prismaService.lessonHashtag.findMany({
        where: {
          lessonId,
        },
        select: { id: true, tag: true },
      });

    return createdLessonHashtags.map((item) => {
      return {
        id: item.id,
        name: item.tag,
      };
    });
  }

  updateHashtag(hashtagId: number, hashtag: string) {
    return this.prismaService.lessonHashtag.update({
      where: { id: hashtagId },
      data: { tag: hashtag },
    });
  }

  async updateManyHashtag(hashtags: string[], lessonId: number) {
    await this.deleteManyHashtag(lessonId);

    return this.createHashtag(hashtags, lessonId);
  }

  deleteManyHashtag(lessonId: number) {
    return this.prismaService.lessonHashtag.deleteMany({
      where: {
        lessonId,
      },
    });
  }

  deleteHashtag(hashtagId: number) {
    return this.prismaService.lessonHashtag.delete({
      where: {
        id: hashtagId,
      },
    });
  }

  readManyHashtag(lessonId: number) {
    return this.prismaService.lessonHashtag.findMany({
      where: {
        lessonId,
      },
    });
  }
}
