import { CreateHashtagDto } from '../dtos/create-hashtag.dto';

export const HASHTAG_SERVICE = 'HASHTAG SERVICE';

export interface HashtagService {
  createHashtag(
    craeteHashtagDto: CreateHashtagDto,
    modelId: number,
    memberId?: number,
  );
  // getHashtag()
  // getHashtags()
  // deleteHashtag()
  // updateHashtag()
}
