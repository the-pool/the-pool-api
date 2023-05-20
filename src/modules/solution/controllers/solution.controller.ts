import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Member } from '@prisma/client';
import { ModelName } from '@src/constants/enum';
import { BearerAuth } from '@src/decorators/bearer-auth.decorator';
import { AllowMemberStatusesSetMetadataGuard } from '@src/decorators/member-statuses-set-metadata.guard-decorator';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '@src/guards/optional-auth-guard';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MemberStatus } from '@src/modules/member/constants/member.enum';
import {
  ApiCreateSolution,
  ApiCreateSolutionLike,
  ApiDeleteSolution,
  ApiDeleteSolutionLike,
  ApiReadManySolution,
  ApiReadOneSolution,
  ApiUpdateSolution,
} from '@src/modules/solution/controllers/solution.controller.swagger';
import { CreateSolutionRequestBodyDto } from '@src/modules/solution/dtos/create-solution-request-body.dto';
import { ReadManySolutionRequestQueryDto } from '@src/modules/solution/dtos/read-many-solution-request-query.dto';
import { UpdateSolutionRequestBodyDto } from '@src/modules/solution/dtos/update-solution-request-body.dto';
import { ReadOneSolutionEntity } from '@src/modules/solution/entities/read-one-solution.entity';
import { SolutionDefaultEntity } from '@src/modules/solution/entities/solution-default.entity';
import { SolutionLikeEntity } from '@src/modules/solution/entities/solution-like.entity';
import { SolutionEntity } from '@src/modules/solution/entities/solution.entity';
import { SolutionService } from '@src/modules/solution/services/solution.service';
import { plainToClass } from 'class-transformer';

@ApiTags('문제 - 풀이')
@Controller()
export class SolutionController {
  constructor(
    private readonly solutionService: SolutionService,
    private readonly prismaService: PrismaService,
  ) {}

  @ApiCreateSolution('문제 - 풀이 생성')
  @AllowMemberStatusesSetMetadataGuard([MemberStatus.Active])
  @BearerAuth(JwtAuthGuard)
  @Post()
  createSolution(
    @Body() requestDto: CreateSolutionRequestBodyDto,
    @UserLogin('id') memberId: number,
  ): Promise<SolutionEntity> {
    return this.solutionService.createSolution(requestDto, memberId);
  }

  @ApiUpdateSolution('문제 - 풀이 수정')
  @AllowMemberStatusesSetMetadataGuard([MemberStatus.Active])
  @BearerAuth(JwtAuthGuard)
  @Put(':id')
  async updateSolution(
    @Param('id') solutionId: number,
    @Body() requestDto: UpdateSolutionRequestBodyDto,
    @UserLogin('id') memberId: number,
  ): Promise<SolutionEntity> {
    await this.prismaService.validateOwnerOrFail(ModelName.LessonSolution, {
      id: solutionId,
      memberId,
    });

    return this.solutionService.updateSolution(requestDto, solutionId);
  }

  @ApiDeleteSolution('문제 - 풀이 삭제')
  @AllowMemberStatusesSetMetadataGuard([MemberStatus.Active])
  @BearerAuth(JwtAuthGuard)
  @Delete(':id')
  async deleteSolution(
    @Param('id') solutionId: number,
    @UserLogin('id') memberId: number,
  ): Promise<SolutionEntity> {
    await this.prismaService.validateOwnerOrFail(ModelName.LessonSolution, {
      id: solutionId,
      memberId,
    });

    return this.solutionService.deleteSolution(solutionId, memberId);
  }

  @ApiReadOneSolution('문제-풀이 상세 조회')
  @BearerAuth(OptionalJwtAuthGuard)
  @Get(':id')
  async readOneSolution(
    @Param('id') solutionId: number,
    @UserLogin() member: Member | { id: null },
  ): Promise<{ solution: ReadOneSolutionEntity }> {
    const readOneSolution = await this.solutionService.readOneSolution(
      solutionId,
      member.id,
    );
    const solution = plainToClass(ReadOneSolutionEntity, readOneSolution);
    return { solution };
  }

  @ApiReadManySolution('문제-풀이 목록 조회')
  @BearerAuth(OptionalJwtAuthGuard)
  @Get()
  readManySolution(
    @Query() query: ReadManySolutionRequestQueryDto,
  ): Promise<{ solutions: SolutionEntity[]; totalCount: number }> {
    return this.solutionService.readManySolution(query);
  }

  @ApiCreateSolutionLike('문제-풀이 좋아요')
  @AllowMemberStatusesSetMetadataGuard([MemberStatus.Active])
  @BearerAuth(JwtAuthGuard)
  @Post(':id/likes')
  async createSolutionLike(
    @Param('id') solutionId: number,
    @UserLogin('id') memberId: number,
  ): Promise<{ solutionLike: SolutionLikeEntity }> {
    const existLike = await this.prismaService.lessonSolutionLike.findFirst({
      where: {
        memberId,
        lessonSolutionId: solutionId,
      },
    });

    if (existLike) return { solutionLike: existLike };

    return {
      solutionLike: await this.solutionService.createLike(solutionId, memberId),
    };
  }

  @ApiDeleteSolutionLike('문제-풀이 좋아요 취소')
  @AllowMemberStatusesSetMetadataGuard([MemberStatus.Active])
  @BearerAuth(JwtAuthGuard)
  @Delete(':id/likes')
  async deleteSolutionLike(
    @Param('id') solutionId: number,
    @UserLogin('id') memberId: number,
  ): Promise<SolutionDefaultEntity> {
    const existLike = await this.prismaService.lessonSolutionLike.findFirst({
      where: {
        memberId,
        lessonSolutionId: solutionId,
      },
    });

    if (!existLike) return { message: 'delete like success' };

    await this.solutionService.deleteLike(solutionId, memberId);
    return { message: 'delete like success' };
  }
}
