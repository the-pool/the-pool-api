import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { DataStructureHelper } from '@src/helpers/data-structure.helper';
import { QueryHelper } from '@src/helpers/query.helper';
import { CommentService } from '../comment/services/comment.service';
import { PrismaModule } from '../core/database/prisma/prisma.module';
import { LessonBookmarkController } from './controllers/lesson-bookmark.controller';
import { LessonCommentController } from './controllers/lesson-comment.controller';
import { LessonEvaluationController } from './controllers/lesson-evaluation.controller';
import { LessonHashtagController } from './controllers/lesson-hashtag.controller';
import { LessonLikeController } from './controllers/lesson-like.controller';
import { LessonController } from './controllers/lesson.controller';
import { LessonBookmarkService } from './services/lesson-bookmark.service';
import { LessonEvaluationService } from './services/lesson-evaluation.service';
import { LessonHashtagService } from './services/lesson-hashtag.service';
import { LessonLikeService } from './services/lesson-like.service';
import { LessonService } from './services/lesson.service';
import { LessonHitListener } from './listeners/lesson-hit.listener';

@Module({
  imports: [
    PrismaModule,
    RouterModule.register([{ path: 'api/lessons', module: LessonModule }]),
  ],
  providers: [
    CommentService,
    LessonBookmarkService,
    LessonLikeService,
    LessonService,
    LessonHashtagService,
    LessonEvaluationService,
    DataStructureHelper,
    QueryHelper,
    LessonHitListener,
  ],
  controllers: [
    LessonHashtagController,
    LessonController,
    LessonEvaluationController,
    LessonBookmarkController,
    LessonCommentController,
    LessonLikeController,
  ],
})
export class LessonModule {}
