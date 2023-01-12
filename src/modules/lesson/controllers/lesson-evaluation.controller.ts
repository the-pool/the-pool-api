import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Member } from '@prisma/client';
import { ModelName } from '@src/constants/enum';
import { BearerAuth } from '@src/decorators/bearer-auth.decorator';
import { SetModelNameToParam } from '@src/decorators/set-model-name-to-param.decorator';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '@src/guards/optional-auth-guard';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { CreateEvaluationDto } from '../dtos/evaluation/create-evaluation.dto';
import { LessonEvaluationQueryDto } from '../dtos/evaluation/lesson-evaluation-query.dto';
import { ReadEvaluationDto } from '../dtos/evaluation/read-evaluation.dto';
import { UpdateEvaluationDto } from '../dtos/lesson/update-evaluation.dto';
import { LessonEvaluationEntity } from '../entities/lesson-evaluation.entity';
import { LessonEvaluationService } from '../services/lesson-evaluation.service';
import {
  ApiCreateEvaluation,
  ApiReadCountedEvaluation,
  ApiReadManyEvaluation,
  ApiUpdateEvaluation,
} from '../swaggers/lesson-evaluation.swagger';

@ApiTags('남들이 평가하는 과제 난이도')
@Controller(':id/evaluations')
export class LessonEvaluationController {
  constructor(
    private readonly lessonEvaluationService: LessonEvaluationService,
    private readonly prismaService: PrismaService,
  ) {}

  @ApiCreateEvaluation('과제 평가 생성')
  @BearerAuth(JwtAuthGuard)
  @Post()
  async createEvaluation(
    @Param() @SetModelNameToParam(ModelName.Lesson) param: IdRequestParamDto,
    @Body() { levelId }: CreateEvaluationDto,
    @UserLogin('id') memberId: number,
  ): Promise<{ evaluation: LessonEvaluationEntity }> {
    await Promise.all([
      this.prismaService.validateOwnerOrFail(ModelName.LessonSolution, {
        memberId,
        lessonId: param.id,
      }),
      this.prismaService.validateDuplicateAndFail(
        ModelName.LessonLevelEvaluation,
        {
          memberId,
          lessonId: param.id,
        },
      ),
    ]);

    const createdEvaluation =
      await this.lessonEvaluationService.createEvaluation(
        param.id,
        memberId,
        levelId,
      );

    return { evaluation: createdEvaluation };
  }

  @ApiUpdateEvaluation('과제 평가 수정')
  @BearerAuth(JwtAuthGuard)
  @Put()
  async updateEvaluation(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
    @Body() { levelId }: UpdateEvaluationDto,
    @UserLogin('id') memberId: number,
  ): Promise<{ evaluation: LessonEvaluationEntity | {} }> {
    await this.prismaService.validateOwnerOrFail(ModelName.LessonSolution, {
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

  @ApiReadCountedEvaluation(
    '과제 평가 난이도별 평가 갯수 & 상세 조회한 유저의 평가 조회',
  )
  @BearerAuth(OptionalJwtAuthGuard)
  @Get('total-count')
  async readCountedEvaluation(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
    @UserLogin() member: Member | { id: null },
  ): Promise<ReadEvaluationDto> {
    const [countedEvaluation, memberEvaluate] = await Promise.all([
      this.lessonEvaluationService.readCountedEvaluation(param.id),
      this.lessonEvaluationService.readMemberEvaluation(param.id, member.id),
    ]);

    return { countedEvaluation, memberEvaluate };
  }

  @ApiReadManyEvaluation('과제 평가 조회')
  @BearerAuth(OptionalJwtAuthGuard)
  @Get()
  async readManyEvaluation(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
    @Query() query: LessonEvaluationQueryDto,
  ): Promise<any> {
    const evaluations = await this.lessonEvaluationService.readManyEvaluation(
      param.id,
      query,
    );

    return { evaluations };
  }
}
