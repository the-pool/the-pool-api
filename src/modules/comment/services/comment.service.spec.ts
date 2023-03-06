import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { ModelName } from '@src/constants/enum';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { PrismaCommentModelName } from '@src/types/type';
import { mockPrismaService } from '../../../../test/mock/mock-prisma-service';
import { CommentEntity } from '../entities/comment.entity';
import { CommentService } from './comment.service';

describe('CommentService', () => {
  let commentService: CommentService;
  let prismaService;

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
    let createCommentColumn = (commentModel: PrismaCommentModelName) => {
      const commentColumnField = {
        [ModelName.LessonComment]: `${ModelName.Lesson}Id`,
      }[commentModel];
      return { [commentColumnField]: faker.datatype.number() };
    };
    let memberId: number;
    let description: string;
    let createdComment: CommentEntity;

    beforeEach(() => {
      createdComment = new CommentEntity();
      memberId = faker.datatype.number();
      description = faker.lorem.text();
    });

    describe('each model test', () => {
      it.each(['lessonComment'])(
        'success - commentModel: %s',
        async (commentModel: PrismaCommentModelName) => {
          prismaService[commentModel].create.mockReturnValue(createdComment);

          const commentColumn = createCommentColumn(commentModel);
          const returnValue = await commentService.createComment(
            commentModel,
            commentColumn,
            memberId,
            description,
          );

          expect(prismaService[commentModel].create).toBeCalledTimes(1);
          expect(prismaService[commentModel].create).toBeCalledWith({
            data: { memberId: memberId, ...commentColumn, description },
          });
          expect(returnValue).toStrictEqual(createdComment);
        },
      );
    });
  });
});
