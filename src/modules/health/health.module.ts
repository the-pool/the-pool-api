import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaModule } from '@src/modules/core/database/prisma/prisma.module';
import { PrismaHealthIndicator } from '@src/modules/health/indicators/prisma-health-indicator';
import { HealthController } from './controllers/health.controller';

@Module({
  imports: [TerminusModule, HttpModule, PrismaModule],
  controllers: [HealthController],
  providers: [PrismaHealthIndicator],
})
export class HealthModule {}
