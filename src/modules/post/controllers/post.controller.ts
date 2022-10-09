import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PostService } from '../services/post.service';
import { CreatePostDto } from '../dto/create-post.dto';
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
import { PatchUpdatePostDto } from '@src/modules/post/dto/patch-update-post.dto';
import { PutUpdatePostDto } from '@src/modules/post/dto/put-update-post-dto';

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

  @ApiOperation({ summary: 'post 수정' })
  @ApiOkResponse({ type: PostEntity })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  putUpdate(
    @Param() @SetModelNameToParam('post') param: IdRequestParamDto,
    @UserLogin('id') authorId: number,
    @Body() putUpdatePostDto: PutUpdatePostDto,
  ) {}

  @ApiOperation({ summary: 'post 일부 수정' })
  @ApiOkResponse({ type: PostEntity })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  patchUpdate(
    @Param() @SetModelNameToParam('post') param: IdRequestParamDto,
    @UserLogin('id') authorId: number,
    @Body() patchUpdatePostDto: PatchUpdatePostDto,
  ): Promise<PostEntity> {
    return this.postService.patchUpdate(param.id, authorId, patchUpdatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
