import { Injectable } from '@nestjs/common';
import { LessonHashtag, LessonHashtagMapping } from '@prisma/client';
import { DataStructureHelper } from '@src/helpers/data-structure.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { LessonHashtagMappingEntity } from '../entities/lesson-hashtag-mapping.entity';

@Injectable()
export class LessonHashtagService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly dataStructureHelper: DataStructureHelper,
  ) {}

  async createManyHashtag(
    lessonHashtagIds: number[],
    lessonId: number,
  ): Promise<(LessonHashtagMapping & { lessonHashtag: LessonHashtag })[]> {
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
  ): Promise<(LessonHashtagMapping & { lessonHashtag: LessonHashtag })[]> {
    await this.deleteManyHashtagByLessonId(lessonId);

    return this.createManyHashtag(lessonHashtagIds, lessonId);
  }

  deleteManyHashtagByHashtagId(
    lessonId: number,
    lessonHashtagIds: number[],
  ): Promise<any> {
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
  ): Promise<(LessonHashtagMapping & { lessonHashtag: LessonHashtag })[]> {
    return this.prismaService.lessonHashtagMapping.findMany({
      where: {
        lessonId,
      },
      include: { lessonHashtag: true },
    });
  }
}
