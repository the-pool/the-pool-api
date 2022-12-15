import { Module } from '@nestjs/common';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { PrismaHelper } from './prisma.helper';

@Module({
  providers: [PrismaService, PrismaHelper],
  exports: [PrismaService, PrismaHelper],
})
export class PrismaModule {}
