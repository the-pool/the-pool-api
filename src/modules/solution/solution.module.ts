import { Module } from '@nestjs/common';
import { JwtStrategy } from '../core/auth/jwt/jwt.strategy';
import { PrismaService } from '../core/database/prisma/prisma.service';
import { NotificationModule } from '../core/notification/notification.module';
import { NotificationService } from '../core/notification/services/notification.service';
import { SolutionController } from './controllers/solution.controller';
import { SolutionService } from './services/solution.service';

@Module({
  imports: [NotificationModule],
  controllers: [SolutionController],
  providers: [SolutionService, PrismaService],
})
export class SolutionModule {}
