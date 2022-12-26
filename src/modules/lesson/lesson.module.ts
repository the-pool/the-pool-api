import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { DataStructureHelper } from '@src/helpers/data-structure.helper';
import { PrismaModule } from '../core/database/prisma/prisma.module';
import { HashtagController } from '../hashtag/controllers/hashtag.controllers';
import { HashtagModule } from '../hashtag/hashtag.module';
import { HASHTAG_SERVICE } from '../hashtag/interfaces/hashtag-service.interface';
import { LessonHashtagService } from '../hashtag/services/lesson-hashtag.service';
import { LessonController } from './controllers/lesson.controller';
import { LessonRepository } from './repositories/lesson.repository';
import { LessonService } from './services/lesson.service';

@Module({
  imports: [
    PrismaModule,
    RouterModule.register([
      {
        path: 'api/lessons',
        module: LessonModule,
        children: [{ path: 'hashtag', module: HashtagModule }],
      },
    ]),
  ],
  providers: [
    LessonService,
    DataStructureHelper,
    LessonRepository,
    {
      provide: HASHTAG_SERVICE,
      useClass: LessonHashtagService,
    },
  ],
  controllers: [LessonController, HashtagController],
})
export class LessonModule {}
