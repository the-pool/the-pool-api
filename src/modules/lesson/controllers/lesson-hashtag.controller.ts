import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  Post,
  Put,
  UseFilters,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
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
import { CreateManyHashtagDto } from '@src/modules/hashtag/dtos/create-many-hashtag.dto';
import { LessonHashtagParamDto } from '@src/modules/hashtag/dtos/hashtag-param.dto';
import { UpdateHashtagDto } from '@src/modules/hashtag/dtos/update-hashtag.dto';
import { UpdateManyHashtagDto } from '@src/modules/hashtag/dtos/update-many-hashtag.dto';
import { LessonHashtagEntity } from '../entities/lesson-hashtag.entity';
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
  @CustomApiResponse(HttpStatus.FORBIDDEN, 'No Lesson found')
  @CustomApiResponse(
    HttpStatus.NOT_FOUND,
    "(과제 번호) doesn't exist id in Lesson",
  )
  @BearerAuth(JwtAuthGuard)
  @UseFilters(NotFoundErrorFilter)
  @Post()
  async createHashtag(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
    @Body() { hashtags }: CreateManyHashtagDto,
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
  @CustomApiResponse(HttpStatus.FORBIDDEN, 'No Lesson found')
  @CustomApiResponse(
    HttpStatus.NOT_FOUND,
    "(과제 번호) doesn't exist id in Lesson",
  )
  @BearerAuth(JwtAuthGuard)
  @UseFilters(NotFoundErrorFilter)
  @Put()
  async updateManyHashtag(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
    @Body() { hashtags }: UpdateManyHashtagDto,
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

  @ApiOperation({ summary: '과제 해시태그 단일 수정' })
  @ApiOkResponse({ type: LessonHashtagEntity })
  @CustomApiResponse(HttpStatus.FORBIDDEN, 'No Lesson found')
  @CustomApiResponse(
    HttpStatus.NOT_FOUND,
    "(과제 번호 or 해시태그 번호) doesn't exist id in Lesson",
  )
  @BearerAuth(JwtAuthGuard)
  @UseFilters(NotFoundErrorFilter)
  @Put(':hashtagId')
  async updateHashtag(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: LessonHashtagParamDto,
    @Body() { hashtag }: UpdateHashtagDto,
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

    return await this.lessonHashtagService.updateHashtag(
      param.hashtagId,
      hashtag,
    );
  }

  @ApiOperation({ summary: '과제 해시태그 단일 삭제' })
  @ApiOkResponse({ type: LessonHashtagEntity })
  @CustomApiResponse(HttpStatus.FORBIDDEN, 'No Lesson found')
  @CustomApiResponse(
    HttpStatus.NOT_FOUND,
    "(과제 번호 or 해시태그 번호) doesn't exist id in Lesson",
  )
  @BearerAuth(JwtAuthGuard)
  @UseFilters(NotFoundErrorFilter)
  @Delete(':hashtagId')
  async deleteHashtag(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: LessonHashtagParamDto,
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

    return await this.lessonHashtagService.deleteHashtag(param.hashtagId);
  }
}
