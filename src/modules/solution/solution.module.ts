import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { QueryHelper } from '@src/helpers/query.helper';
import { CommentService } from '@src/modules/comment/services/comment.service';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MemberStatisticsModule } from '@src/modules/member-statistics/member-statistics.module';
import { SolutionCommentController } from '@src/modules/solution/controllers/solution-comment.controller';
import { SolutionHashtagController } from '@src/modules/solution/controllers/solution-hashtag.controller';
import { SolutionController } from '@src/modules/solution/controllers/solution.controller';
import { LessonSolutionRepository } from '@src/modules/solution/repositories/lesson-solution.repository';
import { SolutionHashtagService } from '@src/modules/solution/services/solution-hashtag.service';
import { SolutionService } from '@src/modules/solution/services/solution.service';

@Module({
  imports: [
    MemberStatisticsModule,
    RouterModule.register([{ path: 'api/solutions', module: SolutionModule }]),
  ],
  providers: [
    CommentService,
    PrismaService,
    SolutionService,
    SolutionHashtagService,
    QueryHelper,
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
