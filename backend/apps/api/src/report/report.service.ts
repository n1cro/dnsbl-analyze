import { Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { ReportsRepository } from '@app/database';
import { DNSBL_JOB, DNSBL_QUEUE, DnsblJobData } from '@app/common';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportResponse } from './interfaces/report-response.interface';

@Injectable()
export class ReportService {
	constructor(
		private readonly reportsRepo: ReportsRepository,
		@InjectQueue(DNSBL_QUEUE) private readonly dnsblQueue: Queue<DnsblJobData>
	) {}

	async create(createReportDto: CreateReportDto): Promise<ReportResponse['reports']> {
		const { targets, blocklists, name } = createReportDto;
		const response: ReportResponse['reports'] = [];

		for (const cidr of targets) {
			const report = await this.reportsRepo.createReport(name, cidr);
			await this.dnsblQueue.add(DNSBL_JOB, {
				cidr,
				blocklists,
				reportId: report.id
			});
			response.push(report);
		}

		return response;
	}

	async getAllReports(): Promise<ReportResponse['reports']> {
		return this.reportsRepo.getAllReports();
	}
}
