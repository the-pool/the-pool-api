import { Controller, Get, InternalServerErrorException, UseGuards } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { NotFoundResponseType } from '@src/types/not-found-response.type';
import { QuestionCategoryEntity } from '../entities/question-category.entity';
import { QuestionService } from '../services/question.service';
import { ApiFindQuestionCategoryList } from './question.swagger';

@ApiTags('커뮤니티 (QnA)')
@Controller('api/questions')
export class QuestionController {
  constructor(
    private readonly questionService: QuestionService
  ) { }

  @ApiFindQuestionCategoryList('QnA 카테고리 리스트 조회')
  @Get('/categories')
  findQuestionCategoryList(): Promise<QuestionCategoryEntity[]> {
    return this.questionService.findQuestionCategoryList();
  }
}
