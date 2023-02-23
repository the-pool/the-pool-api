import { Controller, Delete, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BearerAuth } from '@src/decorators/bearer-auth.decorator';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';

@ApiTags('과제 북마크')
@Controller(':id/bookmark')
export class LessonBookmarkController {
  @BearerAuth(JwtAuthGuard)
  @Post()
  async createBookmark() {}

  @BearerAuth(JwtAuthGuard)
  @Delete()
  async deleteBookmark() {}
}
