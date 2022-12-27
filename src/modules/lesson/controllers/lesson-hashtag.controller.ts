import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Post,
  Put,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, PickType } from '@nestjs/swagger';
import { ModelName } from '@src/constants/enum';
import { BearerAuth } from '@src/decorators/bearer-auth.decorator';
import { CustomApiResponse } from '@src/decorators/custom-api-response.decorator';
import { SetModelNameToParam } from '@src/decorators/set-model-name-to-param.decorator';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { NotFoundErrorFilter } from '@src/filters/not-found-error.filter';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { CreateHashtagDto } from '@src/modules/hashtag/dtos/create-hashtag.dto';
import { LessonEntity } from '../entities/lesson.entity';
import { LessonHashtagService } from '../services/lesson-hashtag.service';

@Controller(':id/hashtags')
export class LessonHashtagController {
  constructor(private readonly lessonHashtagService: LessonHashtagService) {}

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
  ) {
    const createdHashtags = await this.lessonHashtagService.createHashtag(
      hashtags,
      param.id,
      memberId,
    );
    return { hashtags: createdHashtags };
  }

  @Put()
  updateLessonHashtag() {}
}
