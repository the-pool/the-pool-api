import { CoreModule } from '@src/modules/core/core.module';
import { HealthModule } from '@src/modules/health/health.module';
import { MajorModule } from '@src/modules/major/major.module';
import { LessonModule } from './lesson/lesson.module';
import { MemberModule } from './member/member.module';

export const modules = [
  HealthModule,
  CoreModule,
  MemberModule,
  LessonModule,
  MajorModule,
];
