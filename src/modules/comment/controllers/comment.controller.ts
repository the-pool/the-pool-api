import {
  Body,
  Controller,
  OnApplicationBootstrap,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BearerAuth } from '@src/decorators/bearer-auth.decorator';
import { AllowMemberStatusesSetMetadataGuard } from '@src/decorators/member-statuses-set-metadata.guard-decorator';
import { SetModelNameToParamByDomain } from '@src/decorators/set-model-name-to-param-by-domain.decorator';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { MemberStatus } from '@src/modules/member/constants/member.enum';
import { CreateCommentDto } from '../dtos/create-comment.dto';
import { CommentService } from '../services/comment.service';
import { ApiCreateComment } from '../swaggers/comment.swagger';

@ApiTags('댓글')
@Controller(':id/comments')
export class CommentController implements OnApplicationBootstrap {
  constructor(private readonly commentService: CommentService) {}
  onApplicationBootstrap() {}

  @ApiCreateComment('댓글 생성')
  @AllowMemberStatusesSetMetadataGuard([MemberStatus.Active])
  @BearerAuth(JwtAuthGuard)
  @Post()
  async createComment(
    @Param()
    @SetModelNameToParamByDomain()
    param: IdRequestParamDto,
    @Body() { description }: CreateCommentDto,
    @UserLogin('id') memberId: number,
  ) {
    const settedCommentParams = this.commentService.setCommentParams(param);

    const comment = await this.commentService.createComment(
      settedCommentParams,
      memberId,
      description,
    );

    return { comment };
  }
}
