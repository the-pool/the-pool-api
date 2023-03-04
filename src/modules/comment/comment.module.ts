import {
  MiddlewareConsumer,
  Module,
  NestModule,
  SetMetadata,
} from '@nestjs/common';
import {
  COMMENT_COLUMN_NAME_MAPPER,
  DOMAIN_NAME_TO_MODEL_NAME,
} from '@src/constants/constant';
import { DomainName } from '@src/constants/enum';
import { NextFunction } from 'express';
import { PrismaModule } from '../core/database/prisma/prisma.module';
import { CommentController } from './controllers/comment.controller';
import { CommentService } from './services/comment.service';

export const SET_COMMENT_COLUMN_NAME = 'setCommentColumnName';

@Module({
  imports: [PrismaModule],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(this.setDomainNameMetadata).forRoutes(CommentController);
  }

  private setDomainNameMetadata(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    console.log(CommentController.name);

    // SetMetadata(SET_COMMENT_COLUMN_NAME,);

    next();
  }
}
