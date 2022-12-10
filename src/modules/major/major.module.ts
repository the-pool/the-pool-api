import { Module } from '@nestjs/common';
import { PrismaModule } from '@src/modules/core/database/prisma/prisma.module';
import { MajorController } from './controllers/major.controller';
import { MajorService } from './services/major.service';

@Module({
  imports: [PrismaModule],
  controllers: [MajorController],
  providers: [MajorService],
})
export class MajorModule {}
