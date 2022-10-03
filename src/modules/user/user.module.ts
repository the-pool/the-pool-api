import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { PrismaModule } from '@src/modules/core/database/prisma/prisma.module';
import { IsAlreadyExistConstraint } from '@src/decorators/is-already-exist.decorator';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, IsAlreadyExistConstraint],
})
export class UserModule {}
