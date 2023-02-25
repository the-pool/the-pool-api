import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';

export class LessonLikeService {
  constructor(private readonly prismaService: PrismaService) {}

  craeteLike(lessonId: number, memberId: number) {}

  deleteLike(lessonId: number, memberId: number) {}
}
