import { Injectable } from '@nestjs/common';
import { Lesson } from '@prisma/client';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { CreateLessonDto } from '../dtos/create-lesson.dto';

@Injectable()
export class LessonService {
  constructor(private readonly prismaService: PrismaService) {}

  async createLesson(
    createLessonDto: CreateLessonDto,
    memberId: number,
  ): Promise<Lesson> {
    return await this.prismaService.lesson.create({
      data: {
        ...createLessonDto,
        memberId,
      },
    });
  }
}
