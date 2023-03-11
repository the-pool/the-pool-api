import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ModelName } from '@src/constants/enum';
import { BearerAuth } from '@src/decorators/bearer-auth.decorator';
import { AllowMemberStatusesSetMetadataGuard } from '@src/decorators/member-statuses-set-metadata.guard-decorator';
import { SetModelNameToParam } from '@src/decorators/set-model-name-to-param.decorator';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { CreateCommentBaseDto } from '@src/modules/comment/dtos/create-comment.dto';
import { CommentService } from '@src/modules/comment/services/comment.service';
import { MemberStatus } from '@src/modules/member/constants/member.enum';
import { PrismaModelName } from '@src/types/type';
import { LessonCommentEntity } from '../entities/lesson-comment.entity';
import { ApiCreateComment } from '../swaggers/lesson-comment.swagger';

@ApiTags('과제 댓글')
@Controller(':id/comments')
export class LessonCommentController {
  constructor(private readonly commentService: CommentService) {}

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
}
