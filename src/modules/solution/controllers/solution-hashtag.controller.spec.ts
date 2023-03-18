import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import {
  LessonSolutionHashtag,
  LessonSolutionHashtagMapping,
} from '@prisma/client';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { mockPrismaService } from '@test/mock/mock-prisma-service';
import { mockSolutionHashtagService } from '@test/mock/mock-services';
import { CreateSolutionHashtagsRequestBodyDto } from '../dtos/create-solution-hashtags-request-body.dto';
import { SolutionHashtagMappingEntity } from '../entities/solution-hashtag-mapping.entity';
import { SolutionHashtagEntity } from '../entities/solution-hashtag.entity';
import { SolutionHashtagService } from '../services/solution-hashtag.service';
import { SolutionHashtagController } from './solution-hashtag.controller';

describe('LessonHashtagController', () => {
  let solutionHashtagController: SolutionHashtagController;
  let solutionHashtagService;
  let prismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SolutionHashtagController],
      providers: [
        {
          provide: SolutionHashtagService,
          useValue: mockSolutionHashtagService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    solutionHashtagController = module.get<SolutionHashtagController>(
      SolutionHashtagController,
    );
    solutionHashtagService = mockSolutionHashtagService;
    prismaService = mockPrismaService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(SolutionHashtagController).toBeDefined();
  });

  describe('Create Many Hashtag', () => {
    let body: CreateSolutionHashtagsRequestBodyDto;
    let solutionId: number;
    let memberId: number;
    let createHashtags: (LessonSolutionHashtagMapping & {
      lessonSolutionHashtag: LessonSolutionHashtag;
    })[];

    beforeEach(() => {
      memberId = faker.datatype.number();
      solutionId = faker.datatype.number();

      body = new CreateSolutionHashtagsRequestBodyDto();
      createHashtags = [
        {
          ...new SolutionHashtagMappingEntity(),
          lessonSolutionHashtag: new SolutionHashtagEntity(),
        },
      ];

      solutionHashtagService.createManyHashtag.mockReturnValue(createHashtags);
    });

    it('SUCCESS - Create Many Hashtags', async () => {
      const result = await solutionHashtagController.createManyHashtag(
        solutionId,
        body,
        memberId,
      );

      expect(prismaService.validateOwnerOrFail).toBeCalledTimes(1);
      expect(solutionHashtagService.createManyHashtag).toBeCalledTimes(1);
      expect(result).toStrictEqual(createHashtags);
    });
  });
});
