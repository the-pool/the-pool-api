import { Injectable } from '@nestjs/common';
import { ModelName } from '@src/constants/enum';
import { DataStructureHelper } from '@src/helpers/data-structure.helper';
import { PrismaHelper } from '@src/modules/core/database/prisma/prisma.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { LessonHashtagEntity } from '@src/modules/lesson/entities/lesson-hashtag.entity';
import { CreateHashtagDto } from '../dtos/create-hashtag.dto';
import { HashtagService } from '../interfaces/hashtag-service.interface';

@Injectable()
export class LessonHashtagService implements HashtagService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly dataStructureHelper: DataStructureHelper,
  ) {}

  async createHashtag(
    { hashtags }: CreateHashtagDto,
    lessonId: number,
    memberId?: number,
  ) {
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
