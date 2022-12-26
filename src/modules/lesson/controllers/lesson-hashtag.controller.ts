import { Controller, Post, Put, UseInterceptors } from '@nestjs/common';

@Controller('api/lessons/:id/hashtags')
export class LessonHashtagController {
  @Post()
  createLessonHashtag() {}

  @Put()
  updateLessonHashtag() {}
}
