import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IncreaseMemberStatisticsSetMetadataInterceptor } from '@src/decorators/increase-member-statistics-set-metadata.interceptor-decorator';
import { AllowMemberStatusesSetMetadataGuard } from '@src/decorators/member-statuses-set-metadata.guard-decorator';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { MemberStatus } from '@src/modules/member/constants/member.enum';
import { CreateSolutionRequestBodyDto } from '../dtos/create-solution-request-body.dto';
import { SolutionEntity } from '../entities/solution.entity';
import { SolutionService } from '../services/solution.service';
import {
  ApiCreateSolution,
  ApiDeleteSolution,
  ApiReadManySolution,
  ApiReadOneSolution,
  ApiUpdateSolution,
} from './solution.controller.swagger';
import { ReadManySolutionRequestQueryDto } from '../dtos/read-many-solution-request-query.dto';
import { BearerAuth } from '@src/decorators/bearer-auth.decorator';
import { OptionalJwtAuthGuard } from '@src/guards/optional-auth-guard';
import { Member } from '@prisma/client';
import { ReadOneSolutionEntity } from '../entities/read-one-solution.entity';
import { plainToClass } from 'class-transformer';
import { UpdateSolutionRequestBodyDto } from '../dtos/update-solution-request-body.dto';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { ModelName } from '@src/constants/enum';

@ApiTags('문제 - 풀이')
@Controller()
export class SolutionController {
  constructor(
    private readonly solutionService: SolutionService,
    private readonly prismaService: PrismaService,
  ) {}

  @ApiCreateSolution('문제 - 풀이 생성')
  @IncreaseMemberStatisticsSetMetadataInterceptor('solutionCount', 'increment')
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

    return this.solutionService.deleteSolution(solutionId);
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
  @Get()
  readManySolution(
    @Query() query: ReadManySolutionRequestQueryDto,
  ): Promise<{ solutions: SolutionEntity[]; totalCount: number }> {
    return this.solutionService.readManySolution(query);
  }
}
