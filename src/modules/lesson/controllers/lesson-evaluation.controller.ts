import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Member } from '@prisma/client';
import { ModelName } from '@src/constants/enum';
import { ApiFailureResponse } from '@src/decorators/api-failure-response.decorator';
import { ApiSuccessResponse } from '@src/decorators/api-success-response.decorator';
import { BearerAuth } from '@src/decorators/bearer-auth.decorator';
import { SetModelNameToParam } from '@src/decorators/set-model-name-to-param.decorator';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '@src/guards/optional-auth-guard';
import { PrismaHelper } from '@src/modules/core/database/prisma/prisma.helper';
import { CreateEvaluationDto } from '../dtos/create-evaluation.dto';
import { UpdateEvaluationDto } from '../dtos/update-evaluation.dto';
import { LessonEvaluationEntity } from '../entities/lesson-evaluation.entity';
import { LessonEvaluationService } from '../services/lesson-evaluation.service';

@ApiTags('남들이 평가하는 과제 난이도')
@Controller(':id/evaluations')
export class LessonEvaluationController {
  constructor(
    private readonly lessonEvaluationService: LessonEvaluationService,
    private readonly prismaHelper: PrismaHelper,
  ) {}

  @ApiOperation({ summary: '과제 평가 생성' })
  @ApiSuccessResponse(HttpStatus.CREATED, {
    evaluation: LessonEvaluationEntity,
  })
  @ApiFailureResponse(HttpStatus.FORBIDDEN, 'You do not have access to ~')
  @ApiFailureResponse(HttpStatus.NOT_FOUND, "~ doesn't exist id in ~")
  @ApiFailureResponse(HttpStatus.CONFLICT, '~ is duplicatd')
  @BearerAuth(JwtAuthGuard)
  @Post()
  async createEvaluation(
    @Param() @SetModelNameToParam(ModelName.Lesson) param: IdRequestParamDto,
    @Body() { levelId }: CreateEvaluationDto,
    @UserLogin('id') memberId: number,
  ): Promise<{ evaluation: LessonEvaluationEntity }> {
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
  @ApiSuccessResponse(HttpStatus.OK, {
    evaluation: LessonEvaluationEntity,
  })
  @ApiFailureResponse(HttpStatus.FORBIDDEN, 'You do not have access to ~')
  @ApiFailureResponse(HttpStatus.NOT_FOUND, "~ doesn't exist id in ~")
  @BearerAuth(JwtAuthGuard)
  @Put()
  async updateEvaluation(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
    @Body() { levelId }: UpdateEvaluationDto,
    @UserLogin('id') memberId: number,
  ): Promise<{ evaluation: LessonEvaluationEntity | {} }> {
    // member가 lessonId에 해당하는 과제물을 제출하였는지 확인
    await this.prismaHelper.validateOwnerOrFail(ModelName.LessonSolution, {
      memberId,
      lessonId: param.id,
    });

    const updatedEvaluation =
      await this.lessonEvaluationService.updateEvaluation(
        param.id,
        levelId,
        memberId,
      );

    return { evaluation: updatedEvaluation };
  }

  @ApiOperation({ summary: '과제 평가 조회' })
  @BearerAuth(OptionalJwtAuthGuard)
  @Get()
  async readEvaluation(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
    @UserLogin() member: Member | { id: null },
  ) {
    const lessonEvluations = await this.lessonEvaluationService.readEvaluation(
      param.id,
    );
    const isEvaluated = await this.lessonEvaluationService.readMemberEvaluation(
      param.id,
      member.id,
    );
    return { lessonEvluations, isEvaluated };
  }
}
