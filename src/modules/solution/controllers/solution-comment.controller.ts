import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BearerAuth } from '@src/decorators/bearer-auth.decorator';
import { IncreaseMemberStatisticsSetMetadataInterceptor } from '@src/decorators/increase-member-statistics-set-metadata.interceptor-decorator';
import { AllowMemberStatusesSetMetadataGuard } from '@src/decorators/member-statuses-set-metadata.guard-decorator';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { CommentService } from '@src/modules/comment/services/comment.service';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MemberStatus } from '@src/modules/member/constants/member.enum';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { ModelName } from '@src/constants/enum';
import { SetModelNameToParam } from '@src/decorators/set-model-name-to-param.decorator';
import { CreateCommentBaseDto } from '@src/modules/comment/dtos/create-comment-base.dto';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { SolutionCommentEntity } from '../entities/solution-comment.entity';
import { ApiCreateComment } from './solution-comment.swagger';

@ApiTags('문제-풀이의 댓글')
@Controller()
export class SolutionCommentController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly commentService: CommentService,
  ) {}

  @ApiCreateComment('문제-풀이 댓글 생성')
  @IncreaseMemberStatisticsSetMetadataInterceptor(
    'solutionCommentCount',
    'increment',
  )
  @AllowMemberStatusesSetMetadataGuard([MemberStatus.Active])
  @BearerAuth(JwtAuthGuard)
  @Post(':id/comments')
  createComment(
    @Param()
    @SetModelNameToParam(ModelName.LessonSolution)
    param: IdRequestParamDto,
    @Body() { description }: CreateCommentBaseDto,
    @UserLogin('id') memberId: number,
  ): Promise<SolutionCommentEntity> {
    const solutionIdColumn = {
      lessonSolutionId: param.id,
    };

    return this.commentService.createComment(
      ModelName.LessonSolutionComment,
      solutionIdColumn,
      memberId,
      description,
    );
  }
}
