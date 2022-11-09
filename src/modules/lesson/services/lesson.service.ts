import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';

@Injectable()
export class LessonService {
  constructor(private readonly prismaService: PrismaService) {}

  async createLesson(createLessonDto, memberId) {}
}
