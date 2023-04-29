import { IncreaseAction } from '@src/types/type';

export class LessonHitEvent {
  constructor(action: IncreaseAction, lessonId: number) {
    this.action = action;
    this.lessonId = lessonId;
  }

  action: IncreaseAction;
  lessonId: number;
}
