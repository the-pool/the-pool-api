import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UseDevelopmentInterceptor } from '@src/interceptors/use-development.interceptor';
import { UseDevelopmentMiddleware } from '@src/middlewares/use-development.middleware';
import { MemberValidationService } from '@src/modules/member/services/member-validation.service';

import { AuthModule } from '../core/auth/auth.module';
import { PrismaModule } from '../core/database/prisma/prisma.module';
import { MemberController } from './controllers/member.controller';
import { MemberService } from './services/member.service';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [MemberController],
  providers: [
    MemberService,
    MemberValidationService,
    UseDevelopmentInterceptor,
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
