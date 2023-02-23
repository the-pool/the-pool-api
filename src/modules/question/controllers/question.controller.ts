import { Body, Controller, Get, InternalServerErrorException, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { BearerAuth } from '@src/decorators/bearer-auth.decorator';
import { NotFoundResponseType } from '@src/types/not-found-response.type';
import { QuestionCategoryEntity } from '../entities/question-category.entity';
import { QuestionEntity } from '../entities/question.entity';
import { QuestionService } from '../services/question.service';
import { ApiCreateQuestion, ApiFindQuestionCategoryList } from './question.swagger';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { CreateQuestionRequestBodyDto } from '../dtos/create-question-request-body.dto';

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

  @ApiCreateQuestion('Question 생성')
  @UseGuards(JwtAuthGuard)
  @Post()
  createQuestion(
    @Body() createQuestionRequestBodyDto: CreateQuestionRequestBodyDto,
    @UserLogin('id') memberId: number
  ): Promise<QuestionEntity> {
    return this.questionService.createQuestion(
      createQuestionRequestBodyDto,
      memberId
    );
  }
}