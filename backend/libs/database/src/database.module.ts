import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ReportsRepository } from './repositories/reports.repository';

@Module({
	providers: [PrismaService, ReportsRepository],
	exports: [ReportsRepository]
})
export class DatabaseModule {}
