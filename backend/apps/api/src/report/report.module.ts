import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { getBullConfig } from '@app/config';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { DatabaseModule } from '@app/database';
import { DNSBL_QUEUE } from '@app/common';

@Module({
	imports: [
		DatabaseModule,
		BullModule.forRootAsync({
			inject: [ConfigService],
			useFactory: getBullConfig
		}),
		BullModule.registerQueue({
			name: DNSBL_QUEUE
		})
	],
	controllers: [ReportController],
	providers: [ReportService]
})
export class ReportModule {}
