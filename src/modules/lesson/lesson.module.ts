import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { DataStructureHelper } from '@src/helpers/data-structure.helper';
import { PrismaModule } from '../core/database/prisma/prisma.module';
import { LessonEvaluationController } from './controllers/lesson-evaluation.controller';
import { LessonHashtagController } from './controllers/lesson-hashtag.controller';
import { LessonController } from './controllers/lesson.controller';
import { LessonRepository } from './repositories/lesson.repository';
import { LessonEvaluationService } from './services/lesson-evaluation.service';
import { LessonHashtagService } from './services/lesson-hashtag.service';
import { LessonService } from './services/lesson.service';

@Module({
  imports: [
    PrismaModule,
    RouterModule.register([{ path: 'api/lessons', module: LessonModule }]),
  ],
  providers: [
    LessonService,
    LessonHashtagService,
    LessonEvaluationService,
    DataStructureHelper,
    LessonRepository,
  ],
  controllers: [
    LessonController,
    LessonHashtagController,
    LessonEvaluationController,
  ],
})
export class LessonModule {}
