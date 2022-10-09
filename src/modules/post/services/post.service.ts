import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { Post } from '@prisma/client';
import { PostEntity } from '@src/modules/post/entities/post.entity';

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {}

  create(userId: number, createPostDto: CreatePostDto): Promise<Post> {
    return this.prismaService.post.create({
      data: {
        title: createPostDto.title,
        description: createPostDto.description,
        authorId: userId,
      },
    });
  }

  findAll() {
    return `This action returns all post`;
  }

  async findOne(id: number): Promise<PostEntity> {
    const post: Post = await this.prismaService.post.findUnique({
      where: {
        id,
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
