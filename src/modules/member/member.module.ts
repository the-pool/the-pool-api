import { Module } from '@nestjs/common';
import { AuthModule } from '../core/auth/auth.module';
import { MemberController } from './controllers/member.controller';
import { MemberService } from './services/member.service';

@Module({
  imports: [AuthModule],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
