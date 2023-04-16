import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { LessonSolutionRepository } from '@src/modules/solution/repositories/lesson-solution.repository';
import { CommentService } from '../comment/services/comment.service';
import { PrismaService } from '../core/database/prisma/prisma.service';
import { NotificationModule } from '../core/notification/notification.module';
import { SolutionCommentController } from './controllers/solution-comment.controller';
import { SolutionHashtagController } from './controllers/solution-hashtag.controller';
import { SolutionController } from './controllers/solution.controller';
import { SolutionHashtagService } from './services/solution-hashtag.service';
import { SolutionService } from './services/solution.service';

@Module({
  imports: [
    NotificationModule,
    RouterModule.register([{ path: 'api/solutions', module: SolutionModule }]),
  ],
  providers: [
    CommentService,
    PrismaService,
    SolutionService,
    SolutionHashtagService,
    LessonSolutionRepository,
  ],
  controllers: [
    SolutionController,
    SolutionHashtagController,
    SolutionCommentController,
  ],
  exports: [SolutionService],
})
export class SolutionModule {}
