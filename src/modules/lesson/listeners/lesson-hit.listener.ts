import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { LessonHitEvent } from '@src/modules/lesson/events/lesson-hit.event';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { NotificationService } from '@src/modules/core/notification/services/notification.service';

export const LESSON_HIT_EVENT = 'lesson.hit';

@Injectable()
export class LessonHitListener {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  @OnEvent(LESSON_HIT_EVENT)
  increaseLessonHit({ lessonId, action }: LessonHitEvent) {
    this.prismaService.lesson
      .update({
        where: { id: lessonId },
        data: { hit: { [action]: 1 } },
      })
      .catch((error) => {
        this.notificationService
          .warning({
            description: 'increaseLessonHit 도중 발생한 에러',
            body: { lessonId, action },
            stack: error.stack,
          })
          .catch((error) => {
            console.error(error);
          });
      });
  }
}
