import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { ModelName } from '@src/constants/enum';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import {
  PrismaCommentModelName,
  PrismaCommentParentIdColumn,
  PrismaModelName,
} from '@src/types/type';
import { mockPrismaService } from '../../../../test/mock/mock-prisma-service';
import { CommentBaseEntity } from '../entities/comment.entity';
import { CommentService } from './comment.service';

describe('CommentService', () => {
  let commentService: CommentService;
  let prismaService;
  const commentModels: PrismaCommentModelName[] = ['lessonComment'];
  let createCommentColumn = (
    commentModel: PrismaCommentModelName,
  ): Partial<PrismaCommentParentIdColumn> => {
    const commentColumnField = {
      [ModelName.LessonComment]: `${ModelName.Lesson}Id`,
    }[commentModel] as `${Extract<PrismaModelName, 'lesson'>}Id`;

    return { [commentColumnField]: faker.datatype.number() };
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    commentService = module.get<CommentService>(CommentService);
    prismaService = mockPrismaService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(commentService).toBeDefined();
  });

  describe('createComment', () => {
    let memberId: number;
    let description: string;
    let createdComment: CommentBaseEntity;

    beforeEach(() => {
      createdComment = new CommentBaseEntity();
      memberId = faker.datatype.number();
      description = faker.lorem.text();
    });

    describe('each model test', () => {
      it.each(commentModels)(
        'success - commentModel: %s',
        async (commentModel: PrismaCommentModelName) => {
          prismaService[commentModel].create.mockReturnValue(createdComment);

          const parentIdColumn = createCommentColumn(commentModel);
          const returnValue = await commentService.createComment(
            commentModel,
            parentIdColumn,
            memberId,
            description,
          );

          expect(prismaService[commentModel].create).toBeCalledTimes(1);
          expect(prismaService[commentModel].create).toBeCalledWith({
            data: { memberId, ...parentIdColumn, description },
          });
          expect(returnValue).toStrictEqual(createdComment);
        },
      );
    });
  });

  describe('deleteComment', () => {
    let commentId: number;
    let deletedComment: CommentBaseEntity;

    beforeEach(() => {
      deletedComment = new CommentBaseEntity();
      commentId = faker.datatype.number();
    });

    describe('each model test', () => {
      it.each(commentModels)(
        'success - commentModel: %s',
        async (commentModel: PrismaCommentModelName) => {
          prismaService[commentModel].delete.mockReturnValue(deletedComment);

          const returnValue = await commentService.deleteComment(
            commentModel,
            commentId,
          );

          expect(prismaService[commentModel].delete).toBeCalledTimes(1);
          expect(prismaService[commentModel].delete).toBeCalledWith({
            where: { id: commentId },
          });
          expect(returnValue).toStrictEqual(deletedComment);
        },
      );
    });
  });

  describe('updateComment', () => {
    let commentId: number;
    let updatedComment: CommentBaseEntity;
    let description: string;

    beforeEach(() => {
      commentId = faker.datatype.number();
      updatedComment = new CommentBaseEntity();
      description = faker.lorem.text();
    });

    describe('each model test', () => {
      it.each(commentModels)(
        'success - commentModel: %s',
        async (commentModel: PrismaCommentModelName) => {
          prismaService[commentModel].update.mockReturnValue(updatedComment);

          const returnValue = await commentService.updateComment(
            commentModel,
            commentId,
            description,
          );

          expect(prismaService[commentModel].update).toBeCalledTimes(1);
          expect(prismaService[commentModel].update).toBeCalledWith({
            where: {
              id: commentId,
            },
            data: {
              description,
            },
          });
          expect(returnValue).toStrictEqual(updatedComment);
        },
      );
    });
  });

  describe('readManyComment', () => {
    let readManyComment: CommentBaseEntity[];

    beforeEach(() => {
      readManyComment = [new CommentBaseEntity()];
    });

    describe('each model test', () => {
      it.each(commentModels)(
        'success - commentModel: %s',
        async (commentModel: PrismaCommentModelName) => {
          prismaService[commentModel].findMany.mockReturnValue(readManyComment);

          const parentIdColumn = createCommentColumn(commentModel);
          const returnValue = await commentService.readManyComment(
            commentModel,
            parentIdColumn,
          );

          expect(prismaService[commentModel].findMany).toBeCalledTimes(1);
          expect(prismaService[commentModel].findMany).toBeCalledWith({
            where: parentIdColumn,
          });
          expect(returnValue).toStrictEqual(readManyComment);
        },
      );
    });
  });
});
