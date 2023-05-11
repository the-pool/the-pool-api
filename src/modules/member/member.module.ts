import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UseDevelopmentMiddleware } from '@src/middlewares/use-development.middleware';
import { AuthModule } from '@src/modules/core/auth/auth.module';
import { PrismaModule } from '@src/modules/core/database/prisma/prisma.module';
import { MemberController } from '@src/modules/member/controllers/member.controller';
import { IsMemberSocialLinkConstraint } from '@src/modules/member/decorators/is-member-social-link.decorator';
import { MemberValidationService } from '@src/modules/member/services/member-validation.service';
import { MemberService } from '@src/modules/member/services/member.service';
import { SolutionModule } from '@src/modules/solution/solution.module';

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
