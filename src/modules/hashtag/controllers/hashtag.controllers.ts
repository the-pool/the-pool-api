import { Controller, Inject, Post, UseInterceptors } from '@nestjs/common';
import { IsRecordInterceptor } from '@src/interceptors/is-record.interceptor';
import {
  HashtagService,
  HASHTAG_SERVICE,
} from '../interfaces/hashtag-service.interface';

@Controller(':id/hashtags')
@UseInterceptors(IsRecordInterceptor)
export class HashtagController {
  constructor(
    @Inject(HASHTAG_SERVICE)
    private readonly hashtagService: HashtagService,
  ) {}

  @Post()
  createHashtag() {
    this.hashtagService.createHashtag();
  }
}
