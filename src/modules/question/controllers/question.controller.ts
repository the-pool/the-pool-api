import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomApiResponse } from '@src/decorators/custom-api-response.decorator';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { plainToInstance } from 'class-transformer';
import { CreateQuestionRequestBodyDto } from '../dtos/create-question-request-body.dto';
import { QuestionCategoryListDto } from '../dtos/question-category-list.dto';
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
    @Body() body: CreateQuestionRequestBodyDto,
    @UserLogin('id') memberId: number
  ) {

  }


  @ApiOperation({ summary: '질문 카테고리 리스트' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: QuestionCategoryListDto })
  @CustomApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, '서버 에러')
  @Get('categoryList')
  async getQuestionCategoryList(): Promise<QuestionCategoryListDto> {
    const categoryList = await this.questionService.getQuestionCategoryList();

    return plainToInstance(QuestionCategoryListDto, { categoryList });
  }
  // @Get('questionList')
  // async getQuestionList() {

  // }
}
