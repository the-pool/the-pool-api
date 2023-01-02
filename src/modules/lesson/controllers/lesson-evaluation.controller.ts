import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ModelName } from '@src/constants/enum';
import { BearerAuth } from '@src/decorators/bearer-auth.decorator';
import { SetModelNameToParam } from '@src/decorators/set-model-name-to-param.decorator';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { PrismaHelper } from '@src/modules/core/database/prisma/prisma.helper';
import { CreateEvaluationDto } from '../dtos/create-evaluation.dto';
import { LessonEvaluationService } from '../services/lesson-evaluation.service';

@ApiTags('남들이 평가하는 과제 난이도')
@Controller(':id/evaluations')
export class LessonEvaluationController {
  constructor(
    private readonly lessonEvaluationService: LessonEvaluationService,
    private readonly prismaHelper: PrismaHelper,
  ) {}

  /**
   * member가 LessonId에 해당하는 과제물을 제출하였는지 확인
   * true : 과재 평가 생성할 수 있도록,
   * false : 403 과재 평가할 수있는 권한 없다고 알림
   */

  @ApiOperation({ summary: '과제 평가 생성' })
  @BearerAuth(JwtAuthGuard)
  @Post()
  async createEvaluation(
    @Param() @SetModelNameToParam(ModelName.Lesson) param: IdRequestParamDto,
    @Body() { levelId }: CreateEvaluationDto,
    @UserLogin('id') memberId: number,
  ) {
    // member가 lessonId에 해당하는 과제물을 제출하였는지 확인
    await this.prismaHelper.validateOwnerOrFail(ModelName.LessonSolution, {
      memberId,
      lessonId: param.id,
    });

    // 이전에 평가가 있는지 확인
    await this.prismaHelper.validateDuplicateAndFail(
      ModelName.LessonLevelEvaluation,
      {
        memberId,
        lessonId: param.id,
      },
    );

    const createdEvaluation =
      await this.lessonEvaluationService.createEvaluation(
        param.id,
        memberId,
        levelId,
      );

    return { evaluation: createdEvaluation };
  }

  @ApiOperation({ summary: '과제 평가 수정' })
  @Put(':evaluationId')
  updateEvaluation() {}

  @ApiOperation({ summary: '과제 평가 조회' })
  @Get()
  readEvaluation() {}
}
