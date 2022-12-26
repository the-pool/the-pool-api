import {
  Body,
  Controller,
  Inject,
  Param,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { NotFoundErrorFilter } from '@src/filters/not-found-error.filter';
import { IsHostGuard } from '@src/guards/is-host.guard';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { IsRecordGuard } from '@src/guards/is-record.guard';
import { CreateHashtagDto } from '../dtos/create-hashtag.dto';
import {
  HashtagService,
  HASHTAG_SERVICE,
} from '../interfaces/hashtag-service.interface';

@UseGuards(IsHostGuard)
@UseGuards(IsRecordGuard)
@UseGuards(JwtAuthGuard)
@UseFilters(NotFoundErrorFilter)
@Controller(':id/hashtags')
export class HashtagController {
  constructor(
    @Inject(HASHTAG_SERVICE)
    private readonly hashtagService: HashtagService,
  ) {}

  @Post()
  async createHashtag(
    @Param('id') modelId: number,
    @Body() craeteHashtagDto: CreateHashtagDto,
    @UserLogin('id') memberId: number,
  ) {
    const hashtags = await this.hashtagService.createHashtag(
      craeteHashtagDto,
      modelId,
      memberId,
    );
    return { hashtags };
  }
}
