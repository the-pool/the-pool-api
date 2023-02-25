import { Controller, Delete, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { LessonLikeService } from '../services/lesson-like.service';

@ApiTags('과제 좋아요')
@Controller(':id/likes')
export class LessonLikeController {
  constructor(
    private readonly lessonLikeService: LessonLikeService,
    private readonly prismaService: PrismaService,
  ) {}

  @Post()
  async createLike() {}

  @Delete()
  async deleteLike() {}
}
