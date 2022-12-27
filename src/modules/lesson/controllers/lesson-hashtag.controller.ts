import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  Post,
  Put,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  PickType,
} from '@nestjs/swagger';
import { ModelName } from '@src/constants/enum';
import { BearerAuth } from '@src/decorators/bearer-auth.decorator';
import { CustomApiResponse } from '@src/decorators/custom-api-response.decorator';
import { SetModelNameToParam } from '@src/decorators/set-model-name-to-param.decorator';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { NotFoundErrorFilter } from '@src/filters/not-found-error.filter';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { PrismaHelper } from '@src/modules/core/database/prisma/prisma.helper';
import { CreateHashtagDto } from '@src/modules/hashtag/dtos/create-hashtag.dto';
import { DeleteLessonHashtagParamDto } from '@src/modules/hashtag/dtos/delete-hashtag.dto';
import { UpdateHashtagDto } from '@src/modules/hashtag/dtos/update-hashtag.dto';
import { LessonEntity } from '../entities/lesson.entity';
import { LessonHashtagService } from '../services/lesson-hashtag.service';

@ApiTags('과제의 해시태그')
@Controller(':id/hashtags')
export class LessonHashtagController {
  constructor(
    private readonly lessonHashtagService: LessonHashtagService,
    private readonly prismaHelper: PrismaHelper,
  ) {}

  @ApiOperation({ summary: '과제 해시태그 생성' })
  @ApiCreatedResponse({ type: PickType(LessonEntity, ['hashtags']) })
  @CustomApiResponse(HttpStatus.NOT_FOUND, 'No Lesson found')
  @BearerAuth(JwtAuthGuard)
  @UseFilters(NotFoundErrorFilter)
  @Post()
  async createHashtag(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
    @Body() { hashtags }: CreateHashtagDto,
    @UserLogin('id') memberId: number,
  ): Promise<Pick<LessonEntity, 'hashtags'>> {
    await this.prismaHelper.findOneOrFail(ModelName.Lesson, {
      id: param.id,
      memberId,
    });

    const createdHashtags = await this.lessonHashtagService.createHashtag(
      hashtags,
      param.id,
    );
    return { hashtags: createdHashtags };
  }

  @ApiOperation({ summary: '과제 해시태그 대량 수정' })
  @ApiCreatedResponse({ type: PickType(LessonEntity, ['hashtags']) })
  @CustomApiResponse(HttpStatus.NOT_FOUND, 'No Lesson found')
  @BearerAuth(JwtAuthGuard)
  @UseFilters(NotFoundErrorFilter)
  @Put()
  async updateManyHashtag(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
    @Body() { hashtags }: UpdateHashtagDto,
    @UserLogin('id') memberId: number,
  ) {
    await this.prismaHelper.findOneOrFail(ModelName.Lesson, {
      id: param.id,
      memberId,
    });

    const updatedHashtags = await this.lessonHashtagService.updateManyHashtag(
      hashtags,
      param.id,
    );

    return { hashtags: updatedHashtags };
  }

  @ApiOperation({ summary: '과제 해시태그 대량 삭제' })
  @ApiCreatedResponse({ type: PickType(LessonEntity, ['hashtags']) })
  @CustomApiResponse(HttpStatus.NOT_FOUND, 'No Lesson found')
  @BearerAuth(JwtAuthGuard)
  @UseFilters(NotFoundErrorFilter)
  @Delete(':hashtagId')
  async deleteHashtag(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: DeleteLessonHashtagParamDto,
    @UserLogin('id') memberId: number,
  ) {
    // Lesson 주인이 memberId가 맞는지
    await this.prismaHelper.findOneOrFail(ModelName.Lesson, {
      id: param.id,
      memberId,
    });

    // hashtag의 과제 번호가 LessonId가 맞는지
    await this.prismaHelper.findOneOrFail(ModelName.LessonHashtag, {
      id: param.hashtagId,
      lessonId: param.id,
    });

    const deletedHashtags = await this.lessonHashtagService.deleteHashtag(
      param.hashtagId,
    );

    return { hashtags: deletedHashtags };
  }
}
