import { Injectable } from '@nestjs/common';
import { Report, ReportStatus } from '@prisma/client';
import { ReportItem } from '@app/common';

import { PrismaService } from '../prisma.service';

@Injectable()
export class ReportsRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createReport(name: string, cidr: string): Promise<Report> {
		return this.prisma.report.create({
			data: {
				name,
				cidr,
				blocklists: []
			}
		});
	}

	async makeProcessed(id: string, blocklists: ReportItem['blocklists']): Promise<Report> {
		return this.prisma.report.update({
			where: { id },
			data: {
				blocklists,
				processedAt: new Date(),
				status: ReportStatus.PROCESSED
			}
		});
	}

	async getAllReports() {
		return this.prisma.report.findMany();
	}
}
