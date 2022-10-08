import { Module } from '@nestjs/common';
import { PostService } from './services/post.service';
import { PostController } from './controllers/post.controller';
import { PrismaModule } from '@src/modules/core/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
