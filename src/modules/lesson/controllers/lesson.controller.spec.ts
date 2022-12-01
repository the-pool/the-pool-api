import { faker } from '@faker-js/faker';
import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { MockLessonService } from '@src/modules/test/mock-service';
import { CreateLessonDto } from '../dtos/create-lesson.dto';
import { UpdateLessonDto } from '../dtos/update-lesson.dto';
import { LessonService } from '../services/lesson.service';
import { ReadOneLessonResponseType } from '../types/response/read-one-lesson-response.type';
import { LessonController } from './lesson.controller';

describe('LessonController', () => {
  let lessonController: LessonController;
  let lessonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonController],
      providers: [
        {
          provide: LessonService,
          useValue: MockLessonService,
        },
      ],
    }).compile();

    lessonController = module.get<LessonController>(LessonController);
    lessonService = MockLessonService;
  });

  it('should be defined', () => {
    expect(lessonController).toBeDefined();
  });

  describe('createLesson', () => {
    let createLessonDto: CreateLessonDto;
    let memberId: number;

    beforeEach(async () => {
      memberId = faker.datatype.number();
      createLessonDto = {
        levelId: faker.datatype.number(),
        description: faker.lorem.text(),
        title: faker.lorem.words(),
        thumbnail: faker.image.imageUrl(),
        hashtag: ['1', '2', '3'],
      };

      jest.spyOn(lessonService, 'createLesson');
    });

    afterEach(() => {
      lessonService.createLesson.mockRestore();
    });

    it('success', async () => {
      const lesson = {
        id: faker.datatype.number(),
        levelId: faker.datatype.number(),
        description: faker.lorem.text(),
        title: faker.lorem.words(),
        hit: faker.datatype.number(),
        createdAt: faker.date.soon(),
        updatedAt: faker.date.soon(),
        deletedAt: null,
      };

      lessonService.createLesson.mockReturnValue(lesson);

      const returnValue = await lessonController.createLesson(
        createLessonDto,
        memberId,
      );

      expect(returnValue).toStrictEqual(lesson);
      expect(lessonService.createLesson).toBeCalledTimes(1);
    });
  });

  describe('updateLesson', () => {
    let updateLessonDto: UpdateLessonDto;
    let memberId: number;
    let param: IdRequestParamDto;

    beforeEach(async () => {
      memberId = faker.datatype.number();
      updateLessonDto = {
        levelId: faker.datatype.number(),
        description: faker.lorem.text(),
        title: faker.lorem.words(),
        thumbnail: faker.image.imageUrl(),
        hashtag: ['1', '2', '3'],
      };
      param = {
        id: faker.datatype.number(),
        model: 'lesson',
      };

      jest.spyOn(lessonService, 'updateLesson');
      jest.spyOn(lessonService, 'updateLessonHashtag');
    });

    afterEach(() => {
      lessonService.updateLesson.mockRestore();
    });

    it('success', async () => {
      lessonService.updateLesson.mockReturnValue(undefined);
      lessonService.updateLessonHashtag.mockReturnValue(undefined);

      const returnValue = await lessonController.updateLesson(
        param,
        updateLessonDto,
        memberId,
      );

      expect(returnValue).toStrictEqual(undefined);
      expect(lessonService.updateLesson).toBeCalledTimes(1);
      expect(lessonService.updateLessonHashtag).toBeCalledTimes(1);
    });

    it('false - 과제 출제자가 아닌 사람이 수정을 하려고 했을 때', async () => {
      lessonService.updateLesson.mockImplementation(() => {
        throw new ForbiddenException('과제를 수정할 권한이 없습니다.');
      });

      await expect(async () => {
        await lessonController.updateLesson(param, updateLessonDto, memberId);
      }).rejects.toThrowError(
        new ForbiddenException('과제를 수정할 권한이 없습니다.'),
      );
    });
  });

  describe('readOneLesson', () => {
    let param: IdRequestParamDto;
    let member: any;
    let lesson: ReadOneLessonResponseType;
    beforeEach(async () => {
      lesson = {
        title: '제목',
        description: '본문',
        hit: 0,
        updatedAt: new Date(),
        memberId: 1,
        nickname: '닉네임',
        levelId: 1,
        solutionCount: 0,
        hashtag: ['1', '2', '3'],
        isBookmark: false,
        isLike: false,
        lessonLevelEvaluation: {
          top: 1,
          middle: 2,
          bottom: 3,
        },
      };
      param = {
        id: 1,
        model: 'lesson',
      };
      member = {
        id: 1,
      };
    });

    it('success', async () => {
      lessonService.readOneLesson.mockReturnValue(lesson);

      const returnValue = await lessonController.readOneLesson(param, member);

      expect(returnValue).toStrictEqual(lesson);
    });
  });
});
