import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel> implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: ['query', 'warn', 'error'], 
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma connected');

    this.$on('query', (e) => {
      this.logger.debug(`[QUERY] ${e.query}`);
      this.logger.debug(`[PARAMS] ${JSON.stringify(e.params)}`);
      this.logger.debug(`[DURATION] ${e.duration}ms`);
    });

    this.$on('warn', (e) => {
      this.logger.warn(`[WARNING] ${e.message}`);
    });

    this.$on('error', (e) => {
      this.logger.error(`[ERROR] ${e.message}`);
    });
  }

  async onModuleDestroy() {
    this.logger.log('Prisma desconectado');
    await this.$disconnect();
  }
}
