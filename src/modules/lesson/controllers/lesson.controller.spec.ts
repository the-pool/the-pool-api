import { Test, TestingModule } from '@nestjs/testing';
import { MockLessonService } from '@src/modules/test/mock-service';
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
    let spyCreateLesson: jest.SpyInstance;

    beforeEach(async () => {
      memberId = 1;
      createLessonDto = {
        levelId: 1,
        description: 'description',
        title: 'title',
        hashtag: ['a', 'b', 'c'],
      };

      spyCreateLesson = jest.spyOn(lessonService, 'createLesson');
    });

    afterEach(() => {
      spyCreateLesson.mockRestore();
    });

    it('success', async () => {
      const lesson = {
        id: 1,
        levelId: 1,
        description: 'description',
        title: 'title',
        hit: 0,
        createdAt: '2022-10-03T09:54:50.563Z',
        updatedAt: '2022-10-03T09:54:50.563Z',
        deletedAt: null,
      };

      lessonService.createLesson.mockReturnValue(lesson);

      const returnValue = await lessonController.createLesson(
        createLessonDto,
        memberId,
      );

      expect(returnValue).toStrictEqual(lesson);
      expect(spyCreateLesson).toBeCalledTimes(1);
    });
  });
});
