import { ConfigService } from '@nestjs/config';
import { BullRootModuleOptions, RegisterQueueOptions } from '@nestjs/bullmq';
import { DNSBL_QUEUE } from '@app/common';

export async function getBullConfig(
	configService: ConfigService
): Promise<BullRootModuleOptions> {
	return {
		connection: {
			host: configService.get('REDIS_HOST'),
			port: configService.get('REDIS_PORT'),
			password: configService.get('REDIS_PASSWORD')
		},
		defaultJobOptions: {
			// removeOnComplete: 1000,
			// removeOnFail: 5000,
			attempts: 3
		}
	};
}

export async function getQueueConfig(
	configService: ConfigService
): Promise<RegisterQueueOptions> {
	return {
		name: configService.get('DNSBL_QUEUE') || DNSBL_QUEUE
	};
}
