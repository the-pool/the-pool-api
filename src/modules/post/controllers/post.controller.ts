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
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { Post as PostModel } from '@prisma/client';
import { PostEntity } from '@src/modules/post/entities/post.entity';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { SetModelNameToParam } from '@src/decorators/set-model-name-to-param.decorator';

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
  @ApiOperation({ summary: 'post 상세 조회' })
  @ApiOkResponse({ type: PostEntity })
  findOne(
    @Param() @SetModelNameToParam('post') param: IdRequestParamDto,
  ): Promise<PostEntity> {
    return this.postService.findOne(param.id);
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
