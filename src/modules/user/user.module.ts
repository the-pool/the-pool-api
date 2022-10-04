import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { PrismaModule } from '@src/modules/core/database/prisma/prisma.module';
import { IsRecordConstraint } from '@src/decorators/is-record.decorator';
import { AuthModule } from '@src/modules/core/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [UserController],
  providers: [UserService, IsRecordConstraint],
})
export class UserModule {}
