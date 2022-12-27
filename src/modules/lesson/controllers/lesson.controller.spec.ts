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
import { LessonEntity } from '../entities/lesson.entity';
import { SimilarLessonQueryDto } from '../dtos/similar-lesson.dto';

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
    beforeEach(async () => {
      memberId = faker.datatype.number();
      lessonEntity = new LessonEntity();
      updateLessonDto = {
        levelId: faker.datatype.number(),
        description: faker.lorem.text(),
        title: faker.lorem.words(),
        thumbnail: faker.image.imageUrl(),
        categoryId: faker.datatype.number(),
      };
      param = {
        id: faker.datatype.number(),
        model: 'lesson',
      };

      jest.spyOn(lessonService, 'updateLesson');
    });

    afterEach(() => {
      lessonService.updateLesson.mockRestore();
    });

    it('success', async () => {
      lessonService.updateLesson.mockReturnValue(lessonEntity);

      const returnValue = await lessonController.updateLesson(
        param,
        updateLessonDto,
        memberId,
      );

      expect(lessonService.updateLesson).toBeCalledTimes(1);
      expect(returnValue).toBeInstanceOf(LessonEntity);
    });
  });

  describe('deleteLesson', () => {
    let param: IdRequestParamDto;
    let memberId: any;
    let mockLesson: Omit<LessonEntity, 'hashtag'>;
    beforeEach(async () => {
      param = new IdRequestParamDto();
      memberId = faker.datatype.number();
      mockLesson = plainToInstance(
        LessonEntity,
        JSON.parse(faker.datatype.json()),
      );
      mockLessonService.deleteLesson.mockReturnValue(mockLesson);
    });

    it('success', async () => {
      const result = await lessonController.deleteLesson(param, memberId);

      expect(mockLessonService.deleteLesson).toBeCalledWith(memberId, param.id);
      expect(result).toBeInstanceOf(LessonEntity);
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

      const returnValue = await lessonController.readOneLesson(param, member);

      expect(returnValue).toBeInstanceOf(ReadOneLessonDto);
    });
  });

  describe('readSimilarLesson', () => {
    let param: IdRequestParamDto;
    let member: any;
    let query: SimilarLessonQueryDto;
    let mockSimilarLessons: any;

    beforeEach(async () => {
      member = { id: faker.datatype.number() };
      param = {
        id: faker.datatype.number(),
        model: 'lesson',
      };
      query = new SimilarLessonQueryDto();
      mockSimilarLessons = plainToInstance(
        SimilarLessonEntity,
        JSON.parse(faker.datatype.json()),
      );

      mockLessonService.readSimilarLesson.mockReturnValue(mockSimilarLessons);
    });

    it('success - routing, plain object to class object converting', async () => {
      const returnValue = await lessonController.readSimilarLesson(
        param,
        query,
        member,
      );
      expect(mockLessonService.readSimilarLesson).toHaveBeenCalledTimes(1);
      expect(mockLessonService.readSimilarLesson).toBeCalledWith(
        param.id,
        member.id,
        query,
      );
      expect(returnValue).toBeInstanceOf(ReadSimilarLessonDto);
      expect(returnValue.lessons).toStrictEqual(mockSimilarLessons);
    });

    it('success - plainToInstance Transform isBookmark', async () => {
      mockSimilarLessons = plainToInstance(SimilarLessonEntity, [
        {
          isBookmark: faker.datatype.number(),
        },
      ]);
      mockLessonService.readSimilarLesson.mockReturnValue(mockSimilarLessons);

      const returnValue = await lessonController.readSimilarLesson(
        param,
        query,
        member,
      );
      expect(typeof returnValue.lessons[0].isBookmark).toBe('boolean');
    });
  });
});
