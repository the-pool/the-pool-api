import { Module } from '@nestjs/common';
import { QueryHelper } from '@src/helpers/query.helper';
import { IncreaseMemberFollowInterceptor } from '@src/interceptors/increase-member-follow.interceptor';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MemberFriendshipController } from './controllers/member-friendship.controller';
import { MemberFriendshipService } from './services/member-friendship.service';

@Module({
  controllers: [MemberFriendshipController],
  providers: [
    MemberFriendshipService,
    PrismaService,
    QueryHelper,
    IncreaseMemberFollowInterceptor,
  ],
})
export class MemberFriendshipModule {}
