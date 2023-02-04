import { Injectable } from '@nestjs/common';
import { DataStructureHelper } from '@src/helpers/data-structure.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
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

  async updateManyHashtag(
    lessonHashtagIds: number[],
    lessonId: number,
  ): Promise<ReadLessonHashtagDto[]> {
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
