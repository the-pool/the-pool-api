import { Module } from '@nestjs/common';
import { PrismaService } from '../core/database/prisma/prisma.service';
import { NotificationModule } from '../core/notification/notification.module';
import { SolutionController } from './controllers/solution.controller';
import { SolutionService } from './services/solution.service';

@Module({
  imports: [NotificationModule],
  controllers: [SolutionController],
  providers: [SolutionService, PrismaService],
})
export class SolutionModule {}
