import { Injectable } from '@nestjs/common';
import { Lesson, LessonHashtag } from '@prisma/client';
import { PrismaHelper } from '@src/modules/core/database/prisma/prisma.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { CreateLessonDto } from '../dtos/create-lesson.dto';

@Injectable()
export class LessonService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly prismaHelper: PrismaHelper,
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
            data: this.prismaHelper.createManyMapper<{ tag: string }>({
              tag: hashtag,
            }),
          },
        },
      },
    });
  }
}
