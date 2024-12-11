import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ReportsRepository } from '@app/database';
import { DNSBL_QUEUE, DnsblJobData, ReportItem } from '@app/common';
import { ParserService } from './parser.service';

@Processor(DNSBL_QUEUE)
export class DnsblProcessor extends WorkerHost {
	private readonly logger = new Logger(DnsblProcessor.name);

	constructor(
		private readonly parserService: ParserService,
		private readonly reportsRepo: ReportsRepository
	) {
		super();
	}

	async process(job: Job<DnsblJobData>): Promise<void> {
		const { reportId, cidr, blocklists } = job.data;

		try {
			this.logger.log(`Start process | Report: ${reportId} | CIDR: ${cidr}`);

			const { combinedResult, totalErrors } = await this.parserService.processCidr(
				cidr,
				blocklists
			);

			const blocklistsResult: ReportItem['blocklists'] = [];
			for (const [dnsbl, ipList] of combinedResult.entries()) {
				blocklistsResult.push({ id: dnsbl, ipList });
			}
			await this.reportsRepo.makeProcessed(reportId, blocklistsResult);

			this.logger.log(
				`Processed | Report: ${reportId} | CIDR: ${cidr} | Errors: ${totalErrors}`
			);
		} catch (error) {
			this.logger.error(`Failed | Report: ${reportId} | CIDR: ${cidr}`, error);
			throw error;
		}
	}
}
