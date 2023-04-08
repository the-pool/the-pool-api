import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { JwtStrategy } from '../core/auth/jwt/jwt.strategy';
import { PrismaService } from '../core/database/prisma/prisma.service';
import { NotificationModule } from '../core/notification/notification.module';
import { SolutionHashtagController } from './controllers/solution-hashtag.controller';
import { NotificationService } from '../core/notification/services/notification.service';
import { SolutionController } from './controllers/solution.controller';
import { SolutionHashtagService } from './services/solution-hashtag.service';
import { SolutionService } from './services/solution.service';
import { CommentService } from '../comment/services/comment.service';
import { SolutionCommentController } from './controllers/solution-comment.controller';
import { QueryHelper } from '@src/helpers/query.helper';

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
    QueryHelper,
  ],
  controllers: [
    SolutionController,
    SolutionHashtagController,
    SolutionCommentController,
  ],
})
export class SolutionModule {}
