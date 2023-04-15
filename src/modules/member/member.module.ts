import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UseDevelopmentMiddleware } from '@src/middlewares/use-development.middleware';
import { IsMemberSocialLinkConstraint } from '@src/modules/member/decorators/is-member-social-link.decorator';
import { MemberValidationService } from '@src/modules/member/services/member-validation.service';
import { SolutionModule } from '@src/modules/solution/solution.module';

import { AuthModule } from '../core/auth/auth.module';
import { PrismaModule } from '../core/database/prisma/prisma.module';
import { MemberController } from './controllers/member.controller';
import { MemberService } from './services/member.service';

@Module({
  imports: [AuthModule, PrismaModule, SolutionModule],
  controllers: [MemberController],
  providers: [
    MemberService,
    MemberValidationService,
    IsMemberSocialLinkConstraint,
  ],
})
export class MemberModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UseDevelopmentMiddleware).forRoutes({
      path: 'api/members/access-token/:id',
      method: RequestMethod.POST,
    });
  }
}
