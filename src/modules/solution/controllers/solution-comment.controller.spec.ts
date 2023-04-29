import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { ModelName } from '@src/constants/enum';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { CreateCommentBaseDto } from '@src/modules/comment/dtos/create-comment-base.dto';
import { CommentService } from '@src/modules/comment/services/comment.service';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { NotificationService } from '@src/modules/core/notification/services/notification.service';
import { mockPrismaService } from '@test/mock/mock-prisma-service';
import {
  mockCommentService,
  mockNotificationService,
} from '@test/mock/mock-services';
import { SolutionCommentEntity } from '../entities/solution-comment.entity';
import { SolutionCommentController } from './solution-comment.controller';
import { SolutionCommentParamDto } from '../dtos/solution-comment-param.dto';
import { UpdateCommentBaseDto } from '@src/modules/comment/dtos/update-comment-base.dto';
import { ReadManyCommentQueryBaseDto } from '@src/modules/comment/dtos/read-many-comment-query-base.dto';

describe('SolutionCommentController', () => {
  let solutionCommentController: SolutionCommentController;
  let commentService;
  let prismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SolutionCommentController],
      providers: [
        { provide: CommentService, useValue: mockCommentService },
        { provide: NotificationService, useValue: mockNotificationService },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    solutionCommentController = module.get<SolutionCommentController>(
      SolutionCommentController,
    );
    commentService = mockCommentService;
    prismaService = mockPrismaService;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(solutionCommentController).toBeDefined();
  });

  describe('createComment', () => {
    let param: IdRequestParamDto;
    let memberId: number;
    let createCommentDto: CreateCommentBaseDto;
    let solutionComment: SolutionCommentEntity;

    beforeEach(() => {
      param = new IdRequestParamDto();
      memberId = faker.datatype.number();
      createCommentDto = new CreateCommentBaseDto();
      solutionComment = new SolutionCommentEntity();

      commentService.createComment.mockReturnValue(solutionComment);
    });

    it('SUCCESS - check method called', async () => {
      await solutionCommentController.createComment(
        param,
        createCommentDto,
        memberId,
      );

      expect(commentService.createComment).toBeCalledTimes(1);
      expect(commentService.createComment).toBeCalledWith(
        ModelName.LessonSolutionComment,
        {
          lessonSolutionId: param.id,
        },
        memberId,
        createCommentDto.description,
      );
    });

    it('SUCCESS - check Input & Output', async () => {
      const returnValue = await solutionCommentController.createComment(
        param,
        createCommentDto,
        memberId,
      );

      expect(returnValue).toStrictEqual({ solutionComment });
    });
  });
  describe('deleteComment', () => {
    let param: SolutionCommentParamDto;
    let memberId: number;
    let deletedComment: SolutionCommentEntity;

    beforeEach(() => {
      param = new SolutionCommentParamDto();
      memberId = faker.datatype.number();
      deletedComment = new SolutionCommentEntity();

      commentService.deleteComment.mockReturnValue(deletedComment);
    });

    it('success - check method called', async () => {
      await solutionCommentController.deleteComment(param, memberId);

      expect(prismaService.validateOwnerOrFail).toBeCalledTimes(1);
      expect(prismaService.validateOwnerOrFail).toBeCalledWith(
        ModelName.LessonSolutionComment,
        {
          id: param.commentId,
          memberId,
        },
      );
      expect(commentService.deleteComment).toBeCalledTimes(1);
      expect(commentService.deleteComment).toBeCalledWith(
        ModelName.LessonSolutionComment,
        param.commentId,
      );
    });

    it('success - check Input & Output', async () => {
      const returnValue = await solutionCommentController.deleteComment(
        param,
        memberId,
      );

      expect(returnValue).toStrictEqual({ solutionComment: deletedComment });
    });
  });

  describe('updateComment', () => {
    let param: SolutionCommentParamDto;
    let memberId: number;
    let updatedComment: SolutionCommentEntity;
    let updateCommentDto: UpdateCommentBaseDto;

    beforeEach(() => {
      param = new SolutionCommentParamDto();
      memberId = faker.datatype.number();
      updatedComment = new SolutionCommentEntity();
      updateCommentDto = new UpdateCommentBaseDto();

      commentService.updateComment.mockReturnValue(updatedComment);
    });

    it('success - check method called', async () => {
      await solutionCommentController.updateComment(
        param,
        updateCommentDto,
        memberId,
      );

      expect(prismaService.validateOwnerOrFail).toBeCalledTimes(1);
      expect(prismaService.validateOwnerOrFail).toBeCalledWith(
        ModelName.LessonSolutionComment,
        {
          id: param.commentId,
          memberId,
        },
      );
      expect(commentService.updateComment).toBeCalledTimes(1);
      expect(commentService.updateComment).toBeCalledWith(
        ModelName.LessonSolutionComment,
        param.commentId,
        updateCommentDto.description,
      );
    });

    it('success - check Input & Output', async () => {
      const returnValue = await solutionCommentController.updateComment(
        param,
        updateCommentDto,
        memberId,
      );

      expect(returnValue).toStrictEqual({
        solutionComment: updatedComment,
      });
    });
  });

  describe('readManyComment', () => {
    let param: IdRequestParamDto;
    let readManyComment: {
      comments: SolutionCommentEntity[];
      totalCount: number;
    };
    let query: ReadManyCommentQueryBaseDto;

    beforeEach(() => {
      param = new IdRequestParamDto();
      readManyComment = {
        comments: [new SolutionCommentEntity()],
        totalCount: faker.datatype.number(),
      };
      query = new ReadManyCommentQueryBaseDto();

      commentService.readManyComment.mockReturnValue(readManyComment);
    });

    it('success - check method called', async () => {
      await solutionCommentController.readManyComment(param, query);

      expect(commentService.readManyComment).toBeCalledTimes(1);
      expect(commentService.readManyComment).toBeCalledWith(
        ModelName.LessonSolutionComment,
        { lessonId: param.id },
        query,
      );
    });

    it('success - check Input & Output', async () => {
      const returnValue = await solutionCommentController.readManyComment(
        param,
        query,
      );

      expect(returnValue).toStrictEqual({
        solutionComments: readManyComment.comments,
        totalCount: readManyComment.totalCount,
      });
    });
  });
});
