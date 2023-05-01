import { Test, TestingModule } from '@nestjs/testing';
import { LessonHitListener } from './lesson-hit.listener';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { mockPrismaService } from '@test/mock/mock-prisma-service';
import { NotificationService } from '@src/modules/core/notification/services/notification.service';
import { mockNotificationService } from '@test/mock/mock-services';
import { LessonHitEvent } from '../events/lesson-hit.event';
import { faker } from '@faker-js/faker';
import { LessonEntity } from '../entities/lesson.entity';

describe('LessonHitListener', () => {
  let lessonHitListener: LessonHitListener;

  let notificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonHitListener,
        { provide: PrismaService, useValue: mockPrismaService },
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    lessonHitListener = module.get<LessonHitListener>(LessonHitListener);
    notificationService = mockNotificationService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(lessonHitListener).toBeDefined();
  });

  describe('increaseLessonHit', () => {
    it('success - When the action is increase', () => {
      const lessonHitEvent = new LessonHitEvent(
        'increment',
        faker.datatype.number(),
      );

      mockPrismaService.lesson.update.mockResolvedValue(new LessonEntity());

      expect(
        lessonHitListener.increaseLessonHit(lessonHitEvent),
      ).toBeUndefined();

      expect(mockPrismaService.lesson.update).toBeCalledWith({
        where: { id: lessonHitEvent.lessonId },
        data: { hit: { increment: 1 } },
      });
    });

    it('success - when the action is decrease', () => {
      const lessonHitEvent = new LessonHitEvent(
        'decrement',
        faker.datatype.number(),
      );

      mockPrismaService.lesson.update.mockResolvedValue(new LessonEntity());

      expect(
        lessonHitListener.increaseLessonHit(lessonHitEvent),
      ).toBeUndefined();

      expect(mockPrismaService.lesson.update).toBeCalledWith({
        where: { id: lessonHitEvent.lessonId },
        data: { hit: { decrement: 1 } },
      });
    });

    it('false', () => {
      const lessonHitEvent = new LessonHitEvent(
        'decrement',
        faker.datatype.number(),
      );
      const error = new Error();

      mockPrismaService.lesson.update.mockRejectedValue(error);

      expect(
        lessonHitListener.increaseLessonHit(lessonHitEvent),
      ).toBeUndefined();

      expect(mockPrismaService.lesson.update).rejects.toThrow();
    });
  });
});
