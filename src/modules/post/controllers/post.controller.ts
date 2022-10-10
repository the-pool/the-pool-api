import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
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
import { ModelName } from '@src/constants/enum';
import { PostListQueryDto } from '@src/modules/post/dto/post-list-query-dto';
import { SetDefaultPageSize } from '@src/decorators/set-default-pageSize.decorator';

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
  @ApiOperation({ summary: 'post 전체 조회' })
  @ApiOkResponse({ type: [PostEntity] })
  findAll(
    @Query()
    @SetDefaultPageSize(30)
    query: PostListQueryDto,
  ) {
    return this.postService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'post 상세 조회' })
  @ApiOkResponse({ type: PostEntity })
  findOne(
    @Param() @SetModelNameToParam(ModelName.Post) param: IdRequestParamDto,
  ): Promise<PostEntity> {
    return this.postService.findOne(param.id);
  }

  @ApiOperation({ summary: 'post 수정' })
  @ApiOkResponse({ type: PostEntity })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  putUpdate(
    @Param() @SetModelNameToParam(ModelName.Post) param: IdRequestParamDto,
    @UserLogin('id') authorId: number,
    @Body() putUpdatePostDto: PutUpdatePostDto,
  ): Promise<PostEntity> {
    return this.postService.putUpdate(param.id, authorId, putUpdatePostDto);
  }

  @ApiOperation({ summary: 'post 일부 수정' })
  @ApiOkResponse({ type: PostEntity })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  patchUpdate(
    @Param() @SetModelNameToParam(ModelName.Post) param: IdRequestParamDto,
    @UserLogin('id') authorId: number,
    @Body() patchUpdatePostDto: PatchUpdatePostDto,
  ): Promise<PostEntity> {
    return this.postService.patchUpdate(param.id, authorId, patchUpdatePostDto);
  }

  @ApiOperation({ summary: 'post 삭제' })
  @ApiOkResponse({ type: PostEntity })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param() @SetModelNameToParam(ModelName.Post) param: IdRequestParamDto,
    @UserLogin('id') authorId: number,
  ): Promise<PostEntity> {
    return this.postService.remove(param.id, authorId);
  }
}
