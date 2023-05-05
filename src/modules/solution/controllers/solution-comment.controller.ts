import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ModelName } from '@src/constants/enum';
import { BearerAuth } from '@src/decorators/bearer-auth.decorator';
import { AllowMemberStatusesSetMetadataGuard } from '@src/decorators/member-statuses-set-metadata.guard-decorator';
import { SetModelNameToParam } from '@src/decorators/set-model-name-to-param.decorator';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '@src/guards/optional-auth-guard';
import { CreateCommentBaseDto } from '@src/modules/comment/dtos/create-comment-base.dto';
import { ReadManyCommentQueryBaseDto } from '@src/modules/comment/dtos/read-many-comment-query-base.dto';
import { UpdateCommentBaseDto } from '@src/modules/comment/dtos/update-comment-base.dto';
import { CommentService } from '@src/modules/comment/services/comment.service';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MemberStatus } from '@src/modules/member/constants/member.enum';
import {
  ApiCreateComment,
  ApiDeleteComment,
  ApiReadManyComment,
  ApiUpdateComment,
} from '@src/modules/solution/controllers/solution-comment.swagger';
import { SolutionCommentParamDto } from '@src/modules/solution/dtos/solution-comment-param.dto';
import { SolutionCommentEntity } from '@src/modules/solution/entities/solution-comment.entity';

@ApiTags('문제-풀이의 댓글')
@Controller(':id/comments')
export class SolutionCommentController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly commentService: CommentService,
  ) {}

  @ApiCreateComment('풀이 댓글 생성')
  @AllowMemberStatusesSetMetadataGuard([MemberStatus.Active])
  @BearerAuth(JwtAuthGuard)
  @Post()
  async createComment(
    @Param()
    @SetModelNameToParam(ModelName.LessonSolution)
    param: IdRequestParamDto,
    @Body() { description }: CreateCommentBaseDto,
    @UserLogin('id') memberId: number,
  ): Promise<{ solutionComment: SolutionCommentEntity }> {
    const lessonSolutionIdColumn = {
      lessonSolutionId: param.id,
    };
    const solutionComment: SolutionCommentEntity =
      await this.commentService.createComment(
        ModelName.LessonSolutionComment,
        lessonSolutionIdColumn,
        memberId,
        description,
      );

    return { solutionComment };
  }

  @ApiDeleteComment('풀이 댓글 삭제')
  @AllowMemberStatusesSetMetadataGuard([MemberStatus.Active])
  @BearerAuth(JwtAuthGuard)
  @Delete(':commentId')
  async deleteComment(
    @Param()
    @SetModelNameToParam(ModelName.LessonSolution)
    param: SolutionCommentParamDto,
    @UserLogin('id') memberId: number,
  ): Promise<{ solutionComment: SolutionCommentEntity }> {
    await this.prismaService.validateOwnerOrFail(
      ModelName.LessonSolutionComment,
      {
        id: param.commentId,
        memberId,
      },
    );

    const deletedComment = await this.commentService.deleteComment(
      memberId,
      ModelName.LessonSolutionComment,
      param.commentId,
    );

    return { solutionComment: deletedComment };
  }

  @ApiUpdateComment('풀이 댓글 수정')
  @AllowMemberStatusesSetMetadataGuard([MemberStatus.Active])
  @BearerAuth(JwtAuthGuard)
  @Patch(':commentId')
  async updateComment(
    @Param()
    @SetModelNameToParam(ModelName.LessonSolution)
    param: SolutionCommentParamDto,
    @Body() { description }: UpdateCommentBaseDto,
    @UserLogin('id') memberId: number,
  ): Promise<{ solutionComment: SolutionCommentEntity }> {
    await this.prismaService.validateOwnerOrFail(
      ModelName.LessonSolutionComment,
      {
        id: param.commentId,
        memberId,
      },
    );

    const updatedComment = await this.commentService.updateComment(
      ModelName.LessonSolutionComment,
      param.commentId,
      description,
    );

    return { solutionComment: updatedComment };
  }

  @ApiReadManyComment('풀이의 댓글 목록 조회')
  @BearerAuth(OptionalJwtAuthGuard)
  @Get()
  async readManyComment(
    @Param()
    @SetModelNameToParam(ModelName.LessonSolution)
    param: IdRequestParamDto,
    @Query() query: ReadManyCommentQueryBaseDto,
  ): Promise<{
    solutionComments: SolutionCommentEntity[];
    totalCount: number;
  }> {
    const lessonSolutionIdColumn = {
      lessonSolutionId: param.id,
    };

    const { comments, totalCount } = await this.commentService.readManyComment(
      ModelName.LessonSolutionComment,
      lessonSolutionIdColumn,
      query,
    );

    return { solutionComments: comments, totalCount };
  }
}
