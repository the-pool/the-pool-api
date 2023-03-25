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
    let createdComment: SolutionCommentEntity;

    beforeEach(() => {
      param = new IdRequestParamDto();
      memberId = faker.datatype.number();
      createCommentDto = new CreateCommentBaseDto();
      createdComment = new SolutionCommentEntity();

      commentService.createComment.mockReturnValue(createdComment);
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

      expect(returnValue).toStrictEqual(createdComment);
    });
  });
});
