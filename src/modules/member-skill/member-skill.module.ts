import { Module } from '@nestjs/common';
import { QueryHelper } from '@src/helpers/query.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MemberSkillService } from '@src/modules/member-skill/services/member-skill.service';
import { MemberSkillController } from './controllers/member-skill.controller';

@Module({
  controllers: [MemberSkillController],
  providers: [MemberSkillService, PrismaService, QueryHelper],
})
export class MemberSkillModule {}
