import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { ModelName } from '@src/constants/enum';
import { ReadManyCommentQueryBaseDto } from '@src/modules/comment/dtos/read-many-comment-query-base.dto';
import { CommentBaseEntity } from '@src/modules/comment/entities/comment.entity';
import { CommentService } from '@src/modules/comment/services/comment.service';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MemberStatisticsEvent } from '@src/modules/member-statistics/events/member-statistics.event';
import {
  PrismaCommentModelName,
  PrismaCommentParentIdColumn,
  PrismaModelName,
} from '@src/types/type';
import { mockMemberStatisticsEvent } from '@test/mock/mock-event';
import { mockPrismaService } from '@test/mock/mock-prisma-service';

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
        {
          provide: MemberStatisticsEvent,
          useValue: mockMemberStatisticsEvent,
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
          expect(mockMemberStatisticsEvent.register).toBeCalledWith(
            memberId,
            expect.objectContaining({
              fieldName: expect.stringContaining('CommentCount'),
              action: 'increment',
            }),
          );
        },
      );
    });
  });

  describe('deleteComment', () => {
    let memberId: number;
    let commentId: number;
    let deletedComment: CommentBaseEntity;

    beforeEach(() => {
      memberId = faker.datatype.number();
      deletedComment = new CommentBaseEntity();
      commentId = faker.datatype.number();
    });

    describe('each model test', () => {
      it.each(commentModels)(
        'success - commentModel: %s',
        async (commentModel: PrismaCommentModelName) => {
          prismaService[commentModel].delete.mockReturnValue(deletedComment);

          const returnValue = await commentService.deleteComment(
            memberId,
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
          expect(mockMemberStatisticsEvent.register).toBeCalledWith(
            memberId,
            expect.objectContaining({
              fieldName: expect.stringContaining('CommentCount'),
              action: 'decrement',
            }),
          );
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
