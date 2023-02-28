import { Module } from '@nestjs/common';
import { JwtStrategy } from '../core/auth/jwt/jwt.strategy';
import { PrismaService } from '../core/database/prisma/prisma.service';
import { SolutionController } from './controllers/solution.controller';
import { SolutionService } from './services/solution.service';

@Module({
  controllers: [SolutionController],
  providers: [SolutionService, PrismaService, JwtStrategy]
})
export class QuestionModule { }
