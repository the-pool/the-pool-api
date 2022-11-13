import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockLessonService } from '@src/modules/test/mock-service';
import { string } from 'joi';
import { CreateLessonDto } from '../dtos/create-lesson.dto';
import { LessonService } from '../services/lesson.service';
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
});
