import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaModule } from '@src/modules/core/database/prisma/prisma.module';
import { HealthController } from '@src/modules/health/controllers/health.controller';
import { PrismaHealthIndicator } from '@src/modules/health/indicators/prisma-health-indicator';

@Module({
  imports: [TerminusModule, HttpModule, PrismaModule],
  controllers: [HealthController],
  providers: [PrismaHealthIndicator],
})
export class HealthModule {}
