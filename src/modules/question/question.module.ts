import { Module } from '@nestjs/common';
import { PrismaService } from '../core/database/prisma/prisma.service';
import { QuestionController } from './controllers/question.controller';
import { QuestionService } from './services/question.service';

@Module({
  imports: [PrismaService],
  controllers: [QuestionController],
  providers: [QuestionService]
})
export class QuestionModule { }
