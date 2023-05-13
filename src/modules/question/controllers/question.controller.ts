import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiFindQuestionCategoryList } from '@src/modules/question/controllers/question.swagger';
import { QuestionCategoryEntity } from '@src/modules/question/entities/question-category.entity';
import { QuestionService } from '@src/modules/question/services/question.service';

@ApiTags('커뮤니티 (QnA)')
@Controller('api/questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @ApiFindQuestionCategoryList('QnA 카테고리 리스트 조회')
  @Get('/categories')
  findQuestionCategoryList(): Promise<QuestionCategoryEntity[]> {
    return this.questionService.findQuestionCategoryList();
  }
}
