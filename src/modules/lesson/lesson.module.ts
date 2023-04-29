import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { DataStructureHelper } from '@src/helpers/data-structure.helper';
import { QueryHelper } from '@src/helpers/query.helper';
import { CommentService } from '@src/modules/comment/services/comment.service';
import { PrismaModule } from '@src/modules/core/database/prisma/prisma.module';
import { LessonBookmarkController } from '@src/modules/lesson/controllers/lesson-bookmark.controller';
import { LessonCommentController } from '@src/modules/lesson/controllers/lesson-comment.controller';
import { LessonEvaluationController } from '@src/modules/lesson/controllers/lesson-evaluation.controller';
import { LessonHashtagController } from '@src/modules/lesson/controllers/lesson-hashtag.controller';
import { LessonLikeController } from '@src/modules/lesson/controllers/lesson-like.controller';
import { LessonController } from '@src/modules/lesson/controllers/lesson.controller';
import { LessonBookmarkService } from '@src/modules/lesson/services/lesson-bookmark.service';
import { LessonEvaluationService } from '@src/modules/lesson/services/lesson-evaluation.service';
import { LessonHashtagService } from '@src/modules/lesson/services/lesson-hashtag.service';
import { LessonLikeService } from '@src/modules/lesson/services/lesson-like.service';
import { LessonService } from '@src/modules/lesson/services/lesson.service';
import { MemberStatisticsModule } from '@src/modules/member-statistics/member-statistics.module';

@Module({
  imports: [
    PrismaModule,
    MemberStatisticsModule,
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
