import { CoreModule } from '@src/modules/core/core.module';
import { HealthModule } from '@src/modules/health/health.module';
import { MajorModule } from '@src/modules/major/major.module';
import { MemberFriendshipModule } from '@src/modules/member-friendship/member-friendship.module';
import { MemberInterestModule } from '@src/modules/member-interest/member-interest.module';
import { MemberReportModule } from '@src/modules/member-report/member-report.module';
import { MemberSkillModule } from '@src/modules/member-skill/member-skill.module';
import { LessonModule } from './lesson/lesson.module';
import { MemberModule } from './member/member.module';

export const modules = [
  HealthModule,
  CoreModule,
  MemberModule,
  MemberSkillModule,
  MemberReportModule,
  MemberInterestModule,
  MemberFriendshipModule,
  LessonModule,
  MajorModule,
];
