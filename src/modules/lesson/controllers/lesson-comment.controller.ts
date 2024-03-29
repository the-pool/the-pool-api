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
import { LessonCommentParamDto } from '@src/modules/lesson/dtos/comment/lesson-comment-param.dto';
import { LessonCommentEntity } from '@src/modules/lesson/entities/lesson-comment.entity';
import {
  ApiCreateComment,
  ApiDeleteComment,
  ApiReadManyComment,
  ApiUpdateComment,
} from '@src/modules/lesson/swaggers/lesson-comment.swagger';
import { MemberStatus } from '@src/modules/member/constants/member.enum';

@ApiTags('과제 댓글')
@Controller(':id/comments')
export class LessonCommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly prismaService: PrismaService,
  ) {}

  @ApiCreateComment('과제 댓글 생성')
  @AllowMemberStatusesSetMetadataGuard([MemberStatus.Active])
  @BearerAuth(JwtAuthGuard)
  @Post()
  async createComment(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
    @Body() { description }: CreateCommentBaseDto,
    @UserLogin('id') memberId: number,
  ): Promise<{ lessonComment: LessonCommentEntity }> {
    const lessonIdColumn = {
      lessonId: param.id,
    };
    const lessonComment: LessonCommentEntity =
      await this.commentService.createComment(
        ModelName.LessonComment,
        lessonIdColumn,
        memberId,
        description,
      );

    return { lessonComment };
  }

  @ApiDeleteComment('과제 댓글 삭제')
  @AllowMemberStatusesSetMetadataGuard([MemberStatus.Active])
  @BearerAuth(JwtAuthGuard)
  @Delete(':commentId')
  async deleteComment(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: LessonCommentParamDto,
    @UserLogin('id') memberId: number,
  ): Promise<{ lessonComment: LessonCommentEntity }> {
    await this.prismaService.validateOwnerOrFail(ModelName.LessonComment, {
      id: param.commentId,
      memberId,
    });

    const deletedComment = await this.commentService.deleteComment(
      memberId,
      ModelName.LessonComment,
      param.commentId,
    );

    return { lessonComment: deletedComment };
  }

  @ApiUpdateComment('과제 댓글 수정')
  @AllowMemberStatusesSetMetadataGuard([MemberStatus.Active])
  @BearerAuth(JwtAuthGuard)
  @Patch(':commentId')
  async updateComment(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: LessonCommentParamDto,
    @Body() { description }: UpdateCommentBaseDto,
    @UserLogin('id') memberId: number,
  ): Promise<{ lessonComment: LessonCommentEntity }> {
    await this.prismaService.validateOwnerOrFail(ModelName.LessonComment, {
      id: param.commentId,
      memberId,
    });

    const updatedComment = await this.commentService.updateComment(
      ModelName.LessonComment,
      param.commentId,
      description,
    );

    return { lessonComment: updatedComment };
  }

  @ApiReadManyComment('과제의 댓글 목록 조회')
  @BearerAuth(OptionalJwtAuthGuard)
  @Get()
  async readManyComment(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
    @Query() query: ReadManyCommentQueryBaseDto,
  ): Promise<{ lessonComments: LessonCommentEntity[]; totalCount: number }> {
    const lessonIdColumn = {
      lessonId: param.id,
    };

    const { comments, totalCount } = await this.commentService.readManyComment(
      ModelName.LessonComment,
      lessonIdColumn,
      query,
    );

    return { lessonComments: comments, totalCount };
  }
}
