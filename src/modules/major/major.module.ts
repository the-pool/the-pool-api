import { Module } from '@nestjs/common';
import { MajorService } from './services/major.service';
import { MajorController } from './controlles/major.controller';
import { PrismaModule } from '@src/modules/core/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MajorController],
  providers: [MajorService],
})
export class MajorModule {}
