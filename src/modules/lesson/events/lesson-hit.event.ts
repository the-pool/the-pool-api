import { IncreaseAction } from '@src/types/type';

export class LessonHitEvent {
  action: IncreaseAction;
  lessonId: number;

  constructor(partial: LessonHitEvent) {
    Object.assign(this, partial);
  }
}
