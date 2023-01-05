import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  PickType,
} from '@nestjs/swagger';
import { HTTP_ERROR_MESSAGE } from '@src/constants/constant';
import { ModelName } from '@src/constants/enum';
import { ApiFailureResponse } from '@src/decorators/api-failure-response.decorator';
import { ApiSuccessResponse } from '@src/decorators/api-success-response.decorator';
import { BearerAuth } from '@src/decorators/bearer-auth.decorator';
import { SetModelNameToParam } from '@src/decorators/set-model-name-to-param.decorator';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '@src/guards/optional-auth-guard';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
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
    private readonly prismaService: PrismaService,
  ) {}

  @ApiOperation({ summary: '과제 해시태그 생성' })
  @ApiOkResponse({ type: PickType(LessonEntity, ['hashtags']) })
  @ApiFailureResponse(HttpStatus.FORBIDDEN, HTTP_ERROR_MESSAGE.FORBIDDEN)
  @ApiFailureResponse(HttpStatus.NOT_FOUND, HTTP_ERROR_MESSAGE.NOT_FOUND)
  @BearerAuth(JwtAuthGuard)
  @Post()
  async createManyHashtag(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
    @Body() { hashtags }: CreateManyHashtagDto,
    @UserLogin('id') memberId: number,
  ) {
    await this.prismaService.validateOwnerOrFail(ModelName.Lesson, {
      id: param.id,
      memberId,
    });

    const createdHashtags = await this.lessonHashtagService.createManyHashtag(
      hashtags,
      param.id,
    );

    return { hashtags: createdHashtags };
  }

  @ApiOperation({ summary: '과제 해시태그 대량 수정' })
  @ApiOkResponse({ type: PickType(LessonEntity, ['hashtags']) })
  @ApiFailureResponse(HttpStatus.FORBIDDEN, HTTP_ERROR_MESSAGE.FORBIDDEN)
  @ApiFailureResponse(HttpStatus.NOT_FOUND, HTTP_ERROR_MESSAGE.NOT_FOUND)
  @BearerAuth(JwtAuthGuard)
  @Put()
  async updateManyHashtag(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
    @Body() { hashtags }: UpdateManyHashtagDto,
    @UserLogin('id') memberId: number,
  ) {
    await this.prismaService.validateOwnerOrFail(ModelName.Lesson, {
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
  @ApiSuccessResponse(HttpStatus.OK, { hashtag: LessonHashtagEntity })
  @ApiFailureResponse(HttpStatus.FORBIDDEN, HTTP_ERROR_MESSAGE.FORBIDDEN)
  @ApiFailureResponse(HttpStatus.NOT_FOUND, HTTP_ERROR_MESSAGE.NOT_FOUND)
  @BearerAuth(JwtAuthGuard)
  @Put(':hashtagId')
  async updateOneHashtag(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: LessonHashtagParamDto,
    @Body() { hashtag }: UpdateHashtagDto,
    @UserLogin('id') memberId: number,
  ): Promise<{ hashtag: LessonHashtagEntity }> {
    // Lesson 주인이 memberId가 맞는지
    await this.prismaService.validateOwnerOrFail(ModelName.Lesson, {
      id: param.id,
      memberId,
    });

    // hashtag의 과제 번호가 LessonId가 맞는지
    await this.prismaService.validateOwnerOrFail(ModelName.LessonHashtag, {
      id: param.hashtagId,
      lessonId: param.id,
    });

    const updatedHashtag = await this.lessonHashtagService.updateOneHashtag(
      param.hashtagId,
      hashtag,
    );

    return { hashtag: updatedHashtag };
  }

  @ApiOperation({ summary: '과제 해시태그 단일 삭제' })
  @ApiSuccessResponse(HttpStatus.OK, { hashtag: LessonHashtagEntity })
  @ApiFailureResponse(HttpStatus.FORBIDDEN, HTTP_ERROR_MESSAGE.FORBIDDEN)
  @ApiFailureResponse(HttpStatus.NOT_FOUND, HTTP_ERROR_MESSAGE.NOT_FOUND)
  @BearerAuth(JwtAuthGuard)
  @Delete(':hashtagId')
  async deleteOneHashtag(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: LessonHashtagParamDto,
    @UserLogin('id') memberId: number,
  ): Promise<{ hashtag: LessonHashtagEntity }> {
    // Lesson 주인이 memberId가 맞는지
    await this.prismaService.validateOwnerOrFail(ModelName.Lesson, {
      id: param.id,
      memberId,
    });

    // hashtag의 과제 번호가 LessonId가 맞는지
    await this.prismaService.validateOwnerOrFail(ModelName.LessonHashtag, {
      id: param.hashtagId,
      lessonId: param.id,
    });

    const deletedHashtag = await this.lessonHashtagService.deleteOneHashtag(
      param.hashtagId,
    );

    return { hashtag: deletedHashtag };
  }

  @ApiOperation({ summary: '과제의 해시태그 조회' })
  @ApiOkResponse({ type: PickType(LessonEntity, ['hashtags']) })
  @ApiFailureResponse(HttpStatus.NOT_FOUND, HTTP_ERROR_MESSAGE.NOT_FOUND)
  @BearerAuth(OptionalJwtAuthGuard)
  @Get()
  async readManyHashtag(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
  ) {
    const hashtags = await this.lessonHashtagService.readManyHashtag(param.id);

    return { hashtags };
  }

  @ApiOperation({ summary: '과제의 해시태그 단일 조회' })
  @ApiSuccessResponse(HttpStatus.OK, { hashtag: LessonHashtagEntity })
  @ApiFailureResponse(HttpStatus.FORBIDDEN, HTTP_ERROR_MESSAGE.FORBIDDEN)
  @ApiFailureResponse(HttpStatus.NOT_FOUND, HTTP_ERROR_MESSAGE.NOT_FOUND)
  @BearerAuth(OptionalJwtAuthGuard)
  @Get(':hashtagId')
  async readOneHashtag(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: LessonHashtagParamDto,
  ): Promise<{ hashtag: LessonHashtagEntity | null }> {
    await this.prismaService.validateOwnerOrFail(ModelName.LessonHashtag, {
      id: param.hashtagId,
      lessonId: param.id,
    });

    const hashtag = await this.lessonHashtagService.readOneHashtag(
      param.hashtagId,
    );

    return { hashtag };
  }
}
