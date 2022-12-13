import { faker } from '@faker-js/faker';
import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { mockLessonService } from '../../../../test/mock/mock-services';
import { CreateLessonDto } from '../dtos/create-lesson.dto';
import { UpdateLessonDto } from '../dtos/update-lesson.dto';
import { SimilarLessonEntity } from '../entities/similar-lesson.entity';
import { LessonService } from '../services/lesson.service';
import { ReadOneLessonDto } from '../dtos/read-one-lesson.dto';
import { ReadSimilarLessonDto } from '../dtos/read-similar-lesson.dto';
import { LessonController } from './lesson.controller';
import { plainToInstance } from 'class-transformer';
import exp from 'constants';
import { LessonEntity } from '../entities/lesson.entity';

describe('LessonController', () => {
  let lessonController: LessonController;
  let lessonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonController],
      providers: [
        {
          provide: LessonService,
          useValue: mockLessonService,
        },
      ],
    }).compile();

    lessonController = module.get<LessonController>(LessonController);
    lessonService = mockLessonService;
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
        categoryId: faker.datatype.number(),
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
    let lessonEntity;
    let lessonHashtag;
    beforeEach(async () => {
      memberId = faker.datatype.number();
      lessonEntity = new LessonEntity();
      lessonHashtag = [faker.lorem.words()];
      updateLessonDto = {
        levelId: faker.datatype.number(),
        description: faker.lorem.text(),
        title: faker.lorem.words(),
        thumbnail: faker.image.imageUrl(),
        hashtag: ['1', '2', '3'],
        categoryId: faker.datatype.number(),
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
      lessonService.updateLesson.mockReturnValue(lessonEntity);
      lessonService.updateLessonHashtag.mockReturnValue(lessonHashtag);

      const returnValue = await lessonController.updateLesson(
        param,
        updateLessonDto,
        memberId,
      );

      expect(lessonService.updateLesson).toBeCalledTimes(1);
      expect(lessonService.updateLessonHashtag).toBeCalledTimes(1);
      expect(returnValue).toBeInstanceOf(LessonEntity);
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
    let lesson: any;
    beforeEach(async () => {
      lesson = { id: faker.datatype.number() };
      param = {
        id: faker.datatype.number(),
        model: 'lesson',
      };
      member = {
        id: faker.datatype.number(),
      };
    });

    it('success', async () => {
      lessonService.readOneLesson.mockReturnValue(lesson);

      const returnValue = lessonController.readOneLesson(param, member);

      expect(returnValue).toBeInstanceOf(ReadOneLessonDto);
    });
  });

  describe('readSimilarLesson', () => {
    let param: IdRequestParamDto;
    let member: any;
    let mockSimilarLessons: SimilarLessonEntity;

    beforeEach(async () => {
      member = { id: faker.datatype.number() };
      param = {
        id: faker.datatype.number(),
        model: 'lesson',
      };
      mockSimilarLessons = plainToInstance(
        SimilarLessonEntity,
        JSON.parse(faker.datatype.json()),
      );

      mockLessonService.readSimilarLesson.mockReturnValue(mockSimilarLessons);
    });

    it('success - routing, plain object to class object converting', async () => {
      const returnValue = await lessonController.readSimilarLesson(
        param,
        member,
      );

      expect(mockLessonService.readSimilarLesson).toHaveBeenCalledTimes(1);
      expect(mockLessonService.readSimilarLesson).toBeCalledWith(
        param.id,
        member.id,
      );
      expect(returnValue).toBeInstanceOf(ReadSimilarLessonDto);
      expect(returnValue.lessons).toStrictEqual(mockSimilarLessons);
    });

    it('success - plainToInstance Transform isBookmark', async () => {
      mockSimilarLessons = plainToInstance(SimilarLessonEntity, {
        isBookmark: faker.datatype.number(),
      });
      mockLessonService.readSimilarLesson.mockReturnValue(mockSimilarLessons);

      const returnValue = await lessonController.readSimilarLesson(
        param,
        member,
      );

      expect(
        typeof returnValue.lessons['isBookmark'] === 'boolean',
      ).toBeTruthy();
    });
  });
});
