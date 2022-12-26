import { Injectable } from '@nestjs/common';
import { HashtagService } from '../interfaces/hashtag-service.interface';

@Injectable()
export class LessonHashtagService implements HashtagService {
  createHashtag() {
    console.log('여기까지옴');
  }
}
