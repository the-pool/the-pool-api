import { Module } from '@nestjs/common';
import { PrismaModule } from '../core/database/prisma/prisma.module';
import { QuestionController } from './controllers/question.controller';
import { QuestionService } from './services/question.service';

@Module({
  imports: [PrismaModule],
  providers: [QuestionService],
  controllers: [QuestionController]
})
export class QuestionModule { }
