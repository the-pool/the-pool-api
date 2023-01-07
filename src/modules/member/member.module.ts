import { Module } from '@nestjs/common';
import { UseDevelopmentInterceptor } from '@src/interceptors/use-development.interceptor';
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
export class MemberModule {}
