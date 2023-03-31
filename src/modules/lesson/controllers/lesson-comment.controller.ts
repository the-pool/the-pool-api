import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ModelName } from '@src/constants/enum';
import { BearerAuth } from '@src/decorators/bearer-auth.decorator';
import { IncreaseMemberStatisticsSetMetadataInterceptor } from '@src/decorators/increase-member-statistics-set-metadata.interceptor-decorator';
import { AllowMemberStatusesSetMetadataGuard } from '@src/decorators/member-statuses-set-metadata.guard-decorator';
import { SetModelNameToParam } from '@src/decorators/set-model-name-to-param.decorator';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '@src/guards/optional-auth-guard';
import { CreateCommentBaseDto } from '@src/modules/comment/dtos/create-comment-base.dto';
import { UpdateCommentBaseDto } from '@src/modules/comment/dtos/update-comment-base.dto';
import { CommentService } from '@src/modules/comment/services/comment.service';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MemberStatus } from '@src/modules/member/constants/member.enum';
import { LessonCommentParamDto } from '../dtos/comment/lesson-comment-param.dto';
import { LessonCommentEntity } from '../entities/lesson-comment.entity';
import {
  ApiCreateComment,
  ApiDeleteComment,
  ApiReadManyComment,
  ApiUpdateComment,
} from '../swaggers/lesson-comment.swagger';

@ApiTags('과제 댓글')
@Controller(':id/comments')
export class LessonCommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly prismaService: PrismaService,
  ) {}

  @ApiCreateComment('과제 댓글 생성')
  @IncreaseMemberStatisticsSetMetadataInterceptor('commentCount', 'increment')
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
  @IncreaseMemberStatisticsSetMetadataInterceptor('commentCount', 'decrement')
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

  @ApiReadManyComment('과제의 댓글 조회')
  @BearerAuth(OptionalJwtAuthGuard)
  @Get()
  async readManyComment(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
  ) {
    const lessonIdColumn = {
      lessonId: param.id,
    };

    const lessonComments = await this.commentService.readManyComment(
      ModelName.LessonComment,
      lessonIdColumn,
    );

    return { lessonComments };
  }
}
