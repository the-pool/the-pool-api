import { Module } from '@nestjs/common';
import { PrismaModule } from '../core/database/prisma/prisma.module';
import { LessonController } from './controllers/lesson.controller';

@Module({
  imports: [PrismaModule],
  controllers: [LessonController],
})
export class LessonModule {}
