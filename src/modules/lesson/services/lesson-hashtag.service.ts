import { Injectable } from '@nestjs/common';
import { DataStructureHelper } from '@src/helpers/data-structure.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { LessonHashtagMappingEntity } from '@src/modules/lesson/entities/lesson-hashtag-mapping.entity';
import { LessonHashtagEntity } from '@src/modules/lesson/entities/lesson-hashtag.entity';

@Injectable()
export class LessonHashtagService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly dataStructureHelper: DataStructureHelper,
  ) {}

  async createManyHashtag(
    lessonHashtagIds: number[],
    lessonId: number,
  ): Promise<
    (LessonHashtagMappingEntity & { lessonHashtag: LessonHashtagEntity })[]
  > {
    const lessonIds = new Array(lessonHashtagIds.length).fill(lessonId);
    const settledLessonHashtags = this.dataStructureHelper.createManyMapper<
      Pick<LessonHashtagMappingEntity, 'lessonId' | 'lessonHashtagId'>
    >({
      lessonHashtagId: lessonHashtagIds,
      lessonId: lessonIds,
    });

    await this.prismaService.lessonHashtagMapping.createMany({
      data: settledLessonHashtags,
    });

    return this.readManyHashtag(lessonId);
  }

  async updateManyHashtag(
    lessonHashtagIds: number[],
    lessonId: number,
  ): Promise<
    (LessonHashtagMappingEntity & { lessonHashtag: LessonHashtagEntity })[]
  > {
    await this.deleteManyHashtagByLessonId(lessonId);

    return this.createManyHashtag(lessonHashtagIds, lessonId);
  }

  deleteManyHashtagByHashtagId(
    lessonId: number,
    lessonHashtagIds: number[],
  ): Promise<{ count: number }> {
    return this.prismaService.lessonHashtagMapping.deleteMany({
      where: {
        lessonId,
        lessonHashtagId: { in: lessonHashtagIds },
      },
    });
  }

  deleteManyHashtagByLessonId(lessonId: number): Promise<{ count: number }> {
    return this.prismaService.lessonHashtagMapping.deleteMany({
      where: {
        lessonId,
      },
    });
  }

  readManyHashtag(
    lessonId: number,
  ): Promise<
    (LessonHashtagMappingEntity & { lessonHashtag: LessonHashtagEntity })[]
  > {
    return this.prismaService.lessonHashtagMapping.findMany({
      where: {
        lessonId,
      },
      include: { lessonHashtag: true },
    });
  }

  readLessonHashtags(): Promise<LessonHashtagEntity[]> {
    return this.prismaService.lessonHashtag.findMany();
  }
}
