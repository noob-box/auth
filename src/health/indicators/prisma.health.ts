import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PrismaHealthIndicator extends HealthIndicator {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async pingCheck(key: string): Promise<HealthIndicatorResult> {
    let isHealthy = false;

    try {
      const result = await this.prismaService.$queryRaw<[]>`SELECT ${1};`;
      isHealthy = result.length > 0;
    } catch {}
    const result = this.getStatus(key, isHealthy);

    if (result) {
      return result;
    }

    throw new HealthCheckError('Prisma check failed', result);
  }
}
