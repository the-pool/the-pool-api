import { Injectable } from '@nestjs/common';
import { ModelName } from '@src/constants/enum';
import { DataStructureHelper } from '@src/helpers/data-structure.helper';
import { PrismaHelper } from '@src/modules/core/database/prisma/prisma.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { CreateHashtagDto } from '@src/modules/hashtag/dtos/create-hashtag.dto';
import { LessonHashtagEntity } from '@src/modules/lesson/entities/lesson-hashtag.entity';

@Injectable()
export class LessonHashtagService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly prismaHelper: PrismaHelper,
    private readonly dataStructureHelper: DataStructureHelper,
  ) {}

  async createHashtag(
    { hashtags }: CreateHashtagDto,
    lessonId: number,
    memberId: number,
  ) {
    await this.prismaHelper.findOneOrFail(ModelName.Lesson, {
      id: lessonId,
      memberId,
    });

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
        select: { tag: true },
      });

    return createdLessonHashtags.map((item) => {
      return {
        name: item.tag,
      };
    });
  }
}
