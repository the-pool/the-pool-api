import { Controller, Post, Put, UseInterceptors } from '@nestjs/common';
import { LessonIsRecordInterceptor } from '@src/interceptors/lesson-is-record.interceptor';

@Controller('api/lessons/:id/hashtags')
@UseInterceptors(LessonIsRecordInterceptor)
export class LessonHashtagController {
  @Post()
  createLessonHashtag() {}

  @Put()
  updateLessonHashtag() {}
}
