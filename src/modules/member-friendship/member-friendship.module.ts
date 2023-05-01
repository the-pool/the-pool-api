import { Module } from '@nestjs/common';
import { QueryHelper } from '@src/helpers/query.helper';
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
    MemberFriendshipsEvent,
  ],
})
export class MemberFriendshipModule {}
