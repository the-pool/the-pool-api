import { Module } from '@nestjs/common';
import { QueryHelper } from '@src/helpers/query.helper';
import { IncreaseMemberFollowInterceptor } from '@src/interceptors/increase-member-follow.interceptor';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MemberFriendshipController } from '@src/modules/member-friendship/controllers/member-friendship.controller';
import { MemberFriendshipsEvent } from '@src/modules/member-friendship/events/member-friendships.event';
import { MemberFriendshipService } from '@src/modules/member-friendship/services/member-friendship.service';

@Module({
  controllers: [MemberFriendshipController],
  providers: [
    MemberFriendshipService,
    PrismaService,
    QueryHelper,
    IncreaseMemberFollowInterceptor,
    MemberFriendshipsEvent,
  ],
})
export class MemberFriendshipModule {}
