import { Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomApiResponse } from '@src/decorators/custom-api-response.decorator';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { QuestionDto } from '../dtos/question.dto';
import { QuestionService } from '../services/question.service';

@ApiTags('QnA')
@Controller('api/question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) { }

  @ApiOperation({ summary: '질문 생성' })
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: QuestionDto })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @CustomApiResponse(HttpStatus.UNAUTHORIZED, 'Unauthorized')
  @CustomApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, '서버 에러')
  @Post()
  async createQuestion(

  ) {
  }

  @Get('categoryList')
  async getQuestionCategoryList() {

  }
  // @Get('questionList')
  // async getQuestionList() {

  // }
}
