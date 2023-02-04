import { Controller, Get, InternalServerErrorException, UseGuards } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { QuestionCategory } from '@prisma/client';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { NotFoundResponseType } from '@src/types/not-found-response.type';
import { QuestionCategoryEntity } from '../entities/question-category.entity';
import { QuestionService } from '../services/question.service';

@ApiTags('커뮤니티 (QnA)')
@ApiNotFoundResponse({ type: NotFoundResponseType })
@ApiInternalServerErrorResponse({ type: InternalServerErrorException })
@Controller('api/questions')
export class QuestionController {
  constructor(
    private readonly questionService: QuestionService
  ) { }

  @Get('/categories')
  findQuestionCategoryList(): Promise<QuestionCategoryEntity[]> {
    return this.questionService.findQuestionCategoryList();
  }
}
