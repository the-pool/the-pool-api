import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { PrismaModule } from '@src/modules/core/database/prisma/prisma.module';
import { IsRecordConstraint } from '@src/decorators/is-record.decorator';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, IsRecordConstraint],
})
export class UserModule {}
