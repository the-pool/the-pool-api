import { CoreModule } from '@src/modules/core/core.module';
import { HealthModule } from '@src/modules/health/health.module';
import { LessonModule } from '@src/modules/lesson/lesson.module';
import { MajorModule } from '@src/modules/major/major.module';
import { MemberFriendshipModule } from '@src/modules/member-friendship/member-friendship.module';
import { MemberInterestModule } from '@src/modules/member-interest/member-interest.module';
import { MemberSkillModule } from '@src/modules/member-skill/member-skill.module';
import { MemberSocialLinkModule } from '@src/modules/member-social-link/member-social-link.module';
import { MemberStatisticsModule } from '@src/modules/member-statistics/member-statistics.module';
import { MemberModule } from '@src/modules/member/member.module';
import { QuestionModule } from '@src/modules/question/question.module';
import { SolutionModule } from '@src/modules/solution/solution.module';
import { UploadsModule } from '@src/modules/uploads/uploads.module';

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
  UploadsModule,
];
