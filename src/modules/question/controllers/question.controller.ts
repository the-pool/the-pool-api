import { Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomApiResponse } from '@src/decorators/custom-api-response.decorator';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { QuestionService } from '../services/question.service';

@ApiTags('QnA')
@Controller('api/question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '질문 생성' })
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: LessonEntity })
  @CustomApiResponse(HttpStatus.UNAUTHORIZED, 'Unauthorized')
  @CustomApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, '서버 에러')
  async createQuestion() {

  }

  @Get('questionList')
  async getQuestionList() {

  }

  @Get('categoryList')
  async getQuestionCategoryList() {

  }
}
