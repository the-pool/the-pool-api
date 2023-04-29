import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { LessonHitEvent } from '../events/lesson-hit.event';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { NotificationService } from '@src/modules/core/notification/services/notification.service';

export const LESSON_HIT = 'lesson.hit';

@Injectable()
export class LessonHitListener {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  @OnEvent(LESSON_HIT)
  updateLessonHit({ lessonId, action }: LessonHitEvent) {
    this.prismaService.lesson
      .update({
        where: { id: lessonId },
        data: { hit: { [action]: 1 } },
      })
      .catch((error) => {
        this.notificationService.warning({
          description: 'temp',
          body: { lessonId, action },
          stack: error.stack,
        });
      });
  }
}
