import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { getBullConfig, getQueueConfig } from '@app/config';
import { DnsblProcessor } from './dnsbl.processor';
import { ParserService } from './parser.service';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		BullModule.forRootAsync({
			inject: [ConfigService],
			useFactory: getBullConfig
		}),
		BullModule.registerQueueAsync({
			inject: [ConfigService],
			useFactory: getQueueConfig
		}),
		DatabaseModule
	],
	providers: [DnsblProcessor, ParserService]
})
export class ParserModule {}
