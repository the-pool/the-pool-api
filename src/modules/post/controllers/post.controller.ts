import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostService } from '../services/post.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { Post as PostModel } from '@prisma/client';
import { PostEntity } from '@src/modules/post/entities/post.entity';

@ApiBearerAuth()
@ApiTags('post')
@Controller('api/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: 'post 생성' })
  @ApiCreatedResponse({ type: PostEntity })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @UserLogin() user,
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostModel> {
    return this.postService.create(user.id, createPostDto);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
