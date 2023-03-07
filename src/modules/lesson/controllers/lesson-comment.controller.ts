import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ModelName } from '@src/constants/enum';
import { BearerAuth } from '@src/decorators/bearer-auth.decorator';
import { AllowMemberStatusesSetMetadataGuard } from '@src/decorators/member-statuses-set-metadata.guard-decorator';
import { SetModelNameToParam } from '@src/decorators/set-model-name-to-param.decorator';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { CreateCommentDto } from '@src/modules/comment/dtos/create-comment.dto';
import { CommentService } from '@src/modules/comment/services/comment.service';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MemberStatus } from '@src/modules/member/constants/member.enum';
import { PrismaModelName } from '@src/types/type';
import { LessonCommentParamDto } from '../dtos/comment/lesson-comment-param.dto';
import { LessonCommentEntity } from '../entities/lesson-comment.entity';
import {
  ApiCreateComment,
  ApiDeleteComment,
} from '../swaggers/lesson-comment.swagger';

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
    @Body() { description }: CreateCommentDto,
    @UserLogin('id') memberId: number,
  ): Promise<{ comment: LessonCommentEntity }> {
    const commentColumn: Partial<Record<`${PrismaModelName}Id`, number>> = {
      lessonId: param.id,
    };
    const comment: LessonCommentEntity =
      await this.commentService.createComment(
        ModelName.LessonComment,
        commentColumn,
        memberId,
        description,
      );

    return { comment };
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
  ): Promise<{ comment: LessonCommentEntity }> {
    await this.prismaService.validateOwnerOrFail(ModelName.LessonComment, {
      memberId,
      lessonId: param.id,
    });

    const deletedComment = await this.commentService.deleteComment(
      ModelName.LessonComment,
      param.commentId,
    );

    return { comment: deletedComment };
  }
}
