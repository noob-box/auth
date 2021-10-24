import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck, HealthCheckResult } from '@nestjs/terminus';
import { PrismaHealthIndicator } from './indicators/prisma.health';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prismaHealthIndicator: PrismaHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  checkHealth(): Promise<HealthCheckResult> {
    return this.health.check([async () => this.prismaHealthIndicator.pingCheck('database')]);
  }
}
