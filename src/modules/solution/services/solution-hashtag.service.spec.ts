import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  LessonSolutionHashtag,
  LessonSolutionHashtagMapping,
} from '@prisma/client';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { CreateSolutionHashtagsRequestBodyDto } from '@src/modules/solution/dtos/create-solution-hashtags-request-body.dto';
import { SolutionHashtagMappingEntity } from '@src/modules/solution/entities/solution-hashtag-mapping.entity';
import { SolutionHashtagEntity } from '@src/modules/solution/entities/solution-hashtag.entity';
import { SolutionHashtagService } from '@src/modules/solution/services/solution-hashtag.service';
import { mockPrismaService } from '@test/mock/mock-prisma-service';

describe('SolutionHashtagService', () => {
  let solutionHashtagService: SolutionHashtagService;
  let prismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SolutionHashtagService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    solutionHashtagService = module.get<SolutionHashtagService>(
      SolutionHashtagService,
    );
    prismaService = mockPrismaService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(solutionHashtagService).toBeDefined();
  });

  describe('Create Many SolutionHashtag', () => {
    let createSolutionHashtagsDto: CreateSolutionHashtagsRequestBodyDto;
    let solutionId: number;
    let existHashtagList: (LessonSolutionHashtagMapping & {
      lessonSolutionHashtag: LessonSolutionHashtag;
    })[];

    let createdHashtagList: SolutionHashtagEntity[];

    beforeEach(() => {
      const mockHashtagEntity = new SolutionHashtagEntity();
      createSolutionHashtagsDto = new CreateSolutionHashtagsRequestBodyDto();
      createSolutionHashtagsDto.hashtags = [faker.datatype.string()];
      solutionId = faker.datatype.number();
      createdHashtagList = [mockHashtagEntity];
      existHashtagList = [
        {
          ...new SolutionHashtagMappingEntity(),
          lessonSolutionHashtag: new SolutionHashtagEntity(),
        },
      ];

      prismaService.lessonSolutionHashtag.create.mockReturnValue(
        mockHashtagEntity,
      );
      prismaService.lessonSolutionHashtagMapping.findMany.mockResolvedValue(
        existHashtagList,
      );
    });

    it('SUCCESS - Read Exist Hashtags', async () => {
      const result = await solutionHashtagService.findManyHashtag(solutionId);

      expect(
        prismaService.lessonSolutionHashtagMapping.findMany,
      ).toBeCalledWith({
        include: {
          lessonSolutionHashtag: true,
        },
        where: {
          lessonSolutionId: solutionId,
        },
      });
      expect(result).toStrictEqual(existHashtagList);
    });

    it('FAILURE - Hashtag 갯수 초과', async () => {
      createSolutionHashtagsDto.hashtags = Array(5).fill(
        faker.datatype.string(),
      );

      expect(
        solutionHashtagService.createManyHashtag(
          createSolutionHashtagsDto,
          solutionId,
        ),
      ).rejects.toThrowError(
        new BadRequestException('등록 가능한 해시태그의 최대갯수는 5개입니다.'),
      );
    });

    it('SUCCESS - Create Hashtags', async () => {
      const result = await solutionHashtagService.createManyHashtag(
        createSolutionHashtagsDto,
        solutionId,
      );

      expect(result).toStrictEqual(createdHashtagList);
    });
  });
});
