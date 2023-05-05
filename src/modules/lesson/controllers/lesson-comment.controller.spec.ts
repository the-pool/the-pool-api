import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { ModelName } from '@src/constants/enum';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { CreateCommentBaseDto } from '@src/modules/comment/dtos/create-comment-base.dto';
import { ReadManyCommentQueryBaseDto } from '@src/modules/comment/dtos/read-many-comment-query-base.dto';
import { UpdateCommentBaseDto } from '@src/modules/comment/dtos/update-comment-base.dto';
import { CommentService } from '@src/modules/comment/services/comment.service';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { LessonCommentController } from '@src/modules/lesson/controllers/lesson-comment.controller';
import { LessonCommentParamDto } from '@src/modules/lesson/dtos/comment/lesson-comment-param.dto';
import { LessonCommentEntity } from '@src/modules/lesson/entities/lesson-comment.entity';
import { mockPrismaService } from '@test/mock/mock-prisma-service';
import { mockCommentService } from '@test/mock/mock-services';

describe('LessonCommentController', () => {
  let lessonCommentController: LessonCommentController;
  let commentService;
  let prismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonCommentController],
      providers: [
        { provide: CommentService, useValue: mockCommentService },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    lessonCommentController = module.get<LessonCommentController>(
      LessonCommentController,
    );
    commentService = mockCommentService;
    prismaService = mockPrismaService;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(lessonCommentController).toBeDefined();
  });

  describe('createComment', () => {
    let param: IdRequestParamDto;
    let memberId: number;
    let createCommentDto: CreateCommentBaseDto;
    let createdComment: LessonCommentEntity;

    beforeEach(() => {
      param = new IdRequestParamDto();
      memberId = faker.datatype.number();
      createCommentDto = new CreateCommentBaseDto();
      createdComment = new LessonCommentEntity();

      commentService.createComment.mockReturnValue(createdComment);
    });

    it('success - check method called', async () => {
      await lessonCommentController.createComment(
        param,
        createCommentDto,
        memberId,
      );

      expect(commentService.createComment).toBeCalledTimes(1);
      expect(commentService.createComment).toBeCalledWith(
        ModelName.LessonComment,
        {
          lessonId: param.id,
        },
        memberId,
        createCommentDto.description,
      );
    });

    it('success - check Input & Output', async () => {
      const returnValue = await lessonCommentController.createComment(
        param,
        createCommentDto,
        memberId,
      );

      expect(returnValue).toStrictEqual({ lessonComment: createdComment });
    });
  });
  describe('deleteComment', () => {
    let param: LessonCommentParamDto;
    let memberId: number;
    let deletedComment: LessonCommentEntity;

    beforeEach(() => {
      param = new LessonCommentParamDto();
      memberId = faker.datatype.number();
      deletedComment = new LessonCommentEntity();

      commentService.deleteComment.mockReturnValue(deletedComment);
    });

    it('success - check method called', async () => {
      await lessonCommentController.deleteComment(param, memberId);

      expect(prismaService.validateOwnerOrFail).toBeCalledTimes(1);
      expect(prismaService.validateOwnerOrFail).toBeCalledWith(
        ModelName.LessonComment,
        {
          id: param.commentId,
          memberId,
        },
      );
      expect(commentService.deleteComment).toBeCalledTimes(1);
      expect(commentService.deleteComment).toBeCalledWith(
        memberId,
        ModelName.LessonComment,
        param.commentId,
      );
    });

    it('success - check Input & Output', async () => {
      const returnValue = await lessonCommentController.deleteComment(
        param,
        memberId,
      );

      expect(returnValue).toStrictEqual({ lessonComment: deletedComment });
    });
  });

  describe('updateComment', () => {
    let param: LessonCommentParamDto;
    let memberId: number;
    let updatedComment: LessonCommentEntity;
    let updateCommentDto: UpdateCommentBaseDto;

    beforeEach(() => {
      param = new LessonCommentParamDto();
      memberId = faker.datatype.number();
      updatedComment = new LessonCommentEntity();
      updateCommentDto = new UpdateCommentBaseDto();

      commentService.updateComment.mockReturnValue(updatedComment);
    });

    it('success - check method called', async () => {
      await lessonCommentController.updateComment(
        param,
        updateCommentDto,
        memberId,
      );

      expect(prismaService.validateOwnerOrFail).toBeCalledTimes(1);
      expect(prismaService.validateOwnerOrFail).toBeCalledWith(
        ModelName.LessonComment,
        {
          id: param.commentId,
          memberId,
        },
      );
      expect(commentService.updateComment).toBeCalledTimes(1);
      expect(commentService.updateComment).toBeCalledWith(
        ModelName.LessonComment,
        param.commentId,
        updateCommentDto.description,
      );
    });

    it('success - check Input & Output', async () => {
      const returnValue = await lessonCommentController.updateComment(
        param,
        updateCommentDto,
        memberId,
      );

      expect(returnValue).toStrictEqual({
        lessonComment: updatedComment,
      });
    });
  });

  describe('readManyComment', () => {
    let param: IdRequestParamDto;
    let readManyComment: {
      comments: LessonCommentEntity[];
      totalCount: number;
    };
    let query: ReadManyCommentQueryBaseDto;

    beforeEach(() => {
      param = new IdRequestParamDto();
      readManyComment = {
        comments: [new LessonCommentEntity()],
        totalCount: faker.datatype.number(),
      };
      query = new ReadManyCommentQueryBaseDto();

      commentService.readManyComment.mockReturnValue(readManyComment);
    });

    it('success - check method called', async () => {
      await lessonCommentController.readManyComment(param, query);

      expect(commentService.readManyComment).toBeCalledTimes(1);
      expect(commentService.readManyComment).toBeCalledWith(
        ModelName.LessonComment,
        { lessonId: param.id },
        query,
      );
    });

    it('success - check Input & Output', async () => {
      const returnValue = await lessonCommentController.readManyComment(
        param,
        query,
      );

      expect(returnValue).toStrictEqual({
        lessonComments: readManyComment.comments,
        totalCount: readManyComment.totalCount,
      });
    });
  });
});
