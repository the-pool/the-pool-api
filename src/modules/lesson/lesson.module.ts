import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { DataStructureHelper } from '@src/helpers/data-structure.helper';
import { QueryHelper } from '@src/helpers/query.helper';
import { CommentModule } from '../comment/comment.module';
import { PrismaModule } from '../core/database/prisma/prisma.module';
import { LessonBookmarkController } from './controllers/lesson-bookmark.controller';
import { LessonEvaluationController } from './controllers/lesson-evaluation.controller';
import { LessonHashtagController } from './controllers/lesson-hashtag.controller';
import { LessonController } from './controllers/lesson.controller';
import { LessonRepository } from './repositories/lesson.repository';
import { LessonBookmarkService } from './services/lesson-bookmark.service';
import { LessonEvaluationService } from './services/lesson-evaluation.service';
import { LessonHashtagService } from './services/lesson-hashtag.service';
import { LessonService } from './services/lesson.service';

@Module({
  imports: [
    PrismaModule,
    RouterModule.register([
      { path: 'api/lessons', module: LessonModule },
      {
        path: 'api/lessons',
        module: LessonModule,
        children: [{ path: '/', module: CommentModule }],
      },
    ]),
  ],
  providers: [
    LessonBookmarkService,
    LessonService,
    LessonHashtagService,
    LessonEvaluationService,
    DataStructureHelper,
    LessonRepository,
    QueryHelper,
  ],
  controllers: [
    LessonHashtagController,
    LessonController,
    LessonEvaluationController,
    LessonBookmarkController,
  ],
})
export class LessonModule {}
