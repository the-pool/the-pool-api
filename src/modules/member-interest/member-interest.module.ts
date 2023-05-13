import { Module } from '@nestjs/common';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MemberInterestController } from '@src/modules/member-interest/controllers/member-interest.controller';
import { MemberInterestService } from '@src/modules/member-interest/services/member-interest.service';

@Module({
  controllers: [MemberInterestController],
  providers: [PrismaService, MemberInterestService],
})
export class MemberInterestModule {}
