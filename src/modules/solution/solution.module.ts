import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { JwtStrategy } from '../core/auth/jwt/jwt.strategy';
import { PrismaService } from '../core/database/prisma/prisma.service';
import { NotificationModule } from '../core/notification/notification.module';
import { SolutionHashtagController } from './controllers/solution-hashtag.controller';
import { SolutionController } from './controllers/solution.controller';
import { SolutionHashtagService } from './services/solution-hashtag.service';
import { SolutionService } from './services/solution.service';

@Module({
  imports: [
    NotificationModule,
    RouterModule.register([{ path: 'api/solutions', module: SolutionModule }]),
  ],
  providers: [SolutionService, SolutionHashtagService, PrismaService],
  controllers: [SolutionController, SolutionHashtagController],
})
export class SolutionModule {}
