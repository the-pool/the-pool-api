import { Module } from '@nestjs/common';
import { PrismaModule } from '../core/database/prisma/prisma.module';
import { LessonController } from './controllers/lesson.controller';
import { LessonService } from './services/lesson.service';

@Module({
  imports: [PrismaModule],
  providers: [LessonService],
  controllers: [LessonController],
})
export class LessonModule {}
