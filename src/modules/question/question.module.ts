import { Module } from '@nestjs/common';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { QuestionController } from '@src/modules/question/controllers/question.controller';
import { QuestionService } from '@src/modules/question/services/question.service';

@Module({
  controllers: [QuestionController],
  providers: [QuestionService, PrismaService],
})
export class QuestionModule {}
