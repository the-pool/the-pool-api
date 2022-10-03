import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './controllers/health.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaHealthIndicator } from '@src/modules/health/indicators/prisma-health-indicator';
import { PrismaModule } from '@src/modules/core/database/prisma/prisma.module';

@Module({
  imports: [TerminusModule, HttpModule, PrismaModule],
  controllers: [HealthController],
  providers: [PrismaHealthIndicator],
})
export class HealthModule {}
