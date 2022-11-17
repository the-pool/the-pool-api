import { Injectable } from '@nestjs/common';
import { Lesson } from '@prisma/client';
import { DataStructureHelper } from '@src/helpers/data-structure.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { CreateLessonDto } from '../dtos/create-lesson.dto';

@Injectable()
export class LessonService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly dataStructureHelper: DataStructureHelper,
  ) {}

  createLesson(
    { hashtag, ...lesson }: CreateLessonDto,
    memberId: number,
  ): Promise<Lesson> {
    return this.prismaService.lesson.create({
      data: {
        ...lesson,
        memberId,
        LessonHashtag: {
          createMany: {
            data: this.dataStructureHelper.createManyMapper<{ tag: string }>({
              tag: hashtag,
            }),
          },
        },
      },
    });
  }
}
