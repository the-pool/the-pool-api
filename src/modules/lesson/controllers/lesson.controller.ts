import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CustomApiResponse } from '@src/decorators/custom-api-response.decorator';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { CreateLessonDto } from '../dtos/create-lesson.dto';
import { UpdateLessonDto } from '../dtos/update-lesson.dto';
import { LessonEntity } from '../entities/lesson.entity';
import { LessonService } from '../services/lesson.service';
import { SetModelNameToParam } from '@src/decorators/set-model-name-to-param.decorator';
import { ModelName } from '@src/constants/enum';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';

@ApiTags('과제')
@Controller('api/lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  @ApiOperation({ summary: '과제 생성' })
  @ApiCreatedResponse({ type: LessonEntity })
  @CustomApiResponse(HttpStatus.UNAUTHORIZED, 'Unauthorized')
  @CustomApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, '서버 에러')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  createLesson(
    @Body() createLessonDto: CreateLessonDto,
    @UserLogin('id') memberId: number,
  ) {
    return this.lessonService.createLesson(createLessonDto, memberId);
  }

  @Put(':id')
  @ApiOperation({ summary: '과제 수정' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @CustomApiResponse(HttpStatus.UNAUTHORIZED, 'Unauthorized')
  @CustomApiResponse(HttpStatus.FORBIDDEN, '과제를 삭제할 권한이 없습니다.')
  @CustomApiResponse(
    HttpStatus.NOT_FOUND,
    "(과제 번호) doesn't exist id in lesson",
  )
  @ApiNoContentResponse()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateLesson(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
    @Body() { hashtag, ...lesson }: UpdateLessonDto,
    @UserLogin('id') memberId: number,
  ) {
    await this.lessonService.updateLesson(lesson, memberId, param.id);
    await this.lessonService.updateLessonHashtag(hashtag, param.id);
  }
}
