import { CoreModule } from '@src/modules/core/core.module';
import { HealthModule } from '@src/modules/health/health.module';
import { MajorModule } from '@src/modules/major/major.module';
import { MemberFriendshipModule } from '@src/modules/member-friendship/member-friendship.module';
import { MemberInterestModule } from '@src/modules/member-interest/member-interest.module';
import { MemberSkillModule } from '@src/modules/member-skill/member-skill.module';
import { MemberStatisticsModule } from '@src/modules/member-statistics/member-statistics.module';
import { LessonModule } from './lesson/lesson.module';
import { MemberSocialLinkModule } from './member-social-link/member-social-link.module';
import { MemberModule } from './member/member.module';
import { QuestionModule } from './question/question.module';
import { SolutionModule } from './solution/solution.module';

export const modules = [
  HealthModule,
  CoreModule,
  MemberModule,
  MemberSkillModule,
  MemberSocialLinkModule,
  MemberStatisticsModule,
  MemberInterestModule,
  MemberFriendshipModule,
  LessonModule,
  MajorModule,
  QuestionModule,
  SolutionModule,
  QuestionModule,
];
