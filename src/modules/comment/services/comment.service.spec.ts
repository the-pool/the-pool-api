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
import { ReadManyCommentQueryBaseDto } from '../dtos/read-many-comment-query-base.dto';
import { PrismaPromise, prisma } from '@prisma/client';

describe('CommentService', () => {
  let commentService: CommentService;
  let prismaService;
  const commentModels: PrismaCommentModelName[] = ['lessonComment'];
  const createCommentColumn = (
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
            include: {
              member: {
                include: {
                  major: true,
                },
              },
            },
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
            include: {
              member: {
                include: {
                  major: true,
                },
              },
            },
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
            include: {
              member: {
                include: {
                  major: true,
                },
              },
            },
          });
          expect(returnValue).toStrictEqual(updatedComment);
        },
      );
    });
  });

  describe('readManyComment', () => {
    let readManyCommentQuery: Promise<CommentBaseEntity[]>;
    let query: ReadManyCommentQueryBaseDto;
    let totalCountQuery: Promise<number>;

    beforeEach(() => {
      readManyCommentQuery = new Promise((resolve) => {
        resolve([new CommentBaseEntity()]);
      });
      query = new ReadManyCommentQueryBaseDto();
      totalCountQuery = new Promise((resolve) =>
        resolve(faker.datatype.number()),
      );
    });

    describe('each model test', () => {
      it.each(commentModels)(
        'success - commentModel: %s',
        async (commentModel: PrismaCommentModelName) => {
          prismaService[commentModel].findMany.mockReturnValue(
            readManyCommentQuery,
          );
          prismaService[commentModel].count.mockReturnValue(totalCountQuery);
          prismaService.$transaction.mockResolvedValue([
            readManyCommentQuery,
            totalCountQuery,
          ]);

          const parentIdColumn = createCommentColumn(commentModel);
          const returnValue = await commentService.readManyComment(
            commentModel,
            parentIdColumn,
            query,
          );
          const { page, pageSize, orderBy } = query;

          expect(prismaService[commentModel].findMany).toBeCalledTimes(1);
          expect(prismaService[commentModel].findMany).toBeCalledWith({
            include: {
              member: {
                include: { major: true },
              },
            },
            where: parentIdColumn,
            orderBy: { id: orderBy },
            skip: page * pageSize,
            take: pageSize,
          });
          expect(prismaService[commentModel].count).toBeCalledTimes(1);
          expect(prismaService[commentModel].count).toBeCalledWith({
            where: parentIdColumn,
            orderBy: { id: orderBy },
          });
          expect(
            prismaService.$transaction([readManyCommentQuery, totalCountQuery]),
          );

          expect(returnValue).toStrictEqual({
            comments: readManyCommentQuery,
            totalCount: totalCountQuery,
          });
        },
      );
    });
  });
});
