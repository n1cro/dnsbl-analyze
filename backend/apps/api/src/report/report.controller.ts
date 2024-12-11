import { Controller, Get, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportResponse } from './interfaces/report-response.interface';

const REPORT_CTRL_PREFIX = 'report';

@Controller(REPORT_CTRL_PREFIX)
export class ReportController {
	constructor(private readonly reportService: ReportService) {}

	@UsePipes(new ValidationPipe())
	@Post()
	async create(@Body() createReportDto: CreateReportDto): Promise<ReportResponse> {
		const reports = await this.reportService.create(createReportDto);
		return { reports };
	}
	// maybe pagination/limit, проблема если ответов много и будет и массив с ip имеет 8000+ для dnsbl
	// задать опциональный параметр чтобы включить ipList в ответ
	@Get()
	async getAll(): Promise<ReportResponse> {
		const reports = await this.reportService.getAllReports();
		return { reports };
	}
}
