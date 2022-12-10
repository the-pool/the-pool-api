import { Module } from '@nestjs/common';
import { DataStructureHelper } from '@src/helpers/data-structure.helper';
import { PrismaModule } from '../core/database/prisma/prisma.module';
import { LessonController } from './controllers/lesson.controller';
import { LessonRepository } from './repositories/lesson.repository';
import { LessonService } from './services/lesson.service';

@Module({
  imports: [PrismaModule],
  providers: [LessonService, DataStructureHelper, LessonRepository],
  controllers: [LessonController],
})
export class LessonModule {}
