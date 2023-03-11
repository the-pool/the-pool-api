import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { ModelName } from '@src/constants/enum';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { CreateCommentBaseDto } from '@src/modules/comment/dtos/create-comment.dto';
import { CommentService } from '@src/modules/comment/services/comment.service';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { mockPrismaService } from '../../../../test/mock/mock-prisma-service';
import { mockCommentService } from '../../../../test/mock/mock-services';
import { LessonCommentParamDto } from '../dtos/comment/lesson-comment-param.dto';
import { LessonCommentEntity } from '../entities/lesson-comment.entity';
import { LessonCommentController } from './lesson-comment.controller';

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
          memberId,
          lessonId: param.id,
        },
      );
      expect(commentService.deleteComment).toBeCalledTimes(1);
      expect(commentService.deleteComment).toBeCalledWith(
        ModelName.LessonComment,
        param.commentId,
      );
    });

    it('success - check Input & Output', async () => {
      const returnValue = await lessonCommentController.deleteComment(
        param,
        memberId,
      );

      expect(returnValue).toStrictEqual({ comment: deletedComment });
    });
  });
});
