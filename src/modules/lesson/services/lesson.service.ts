import { Injectable } from '@nestjs/common';
import { Lesson, LessonHashtag } from '@prisma/client';
import { createManyMapper } from '@src/common/common';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { CreateLessonDto } from '../dtos/create-lesson.dto';

@Injectable()
export class LessonService {
  constructor(private readonly prismaService: PrismaService) {}

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
            data: createManyMapper<{
              tag: string;
            }>({ tag: hashtag }),
          },
        },
      },
    });
  }
}

const a = [1, 2, 3, 4];
const b = [1, 2, 3];

createManyMapper<{ a: number; b: number }>({ a, b });
