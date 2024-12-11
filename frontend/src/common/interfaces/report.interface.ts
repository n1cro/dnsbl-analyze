export enum ReportStatus {
	PROCESSED = 'PROCESSED',
	FAILED = 'FAILED',
	QUEUED = 'QUEUED'
}

export interface ReportItem {
	id: string;
	name: string;
	cidr: string;
	status: ReportStatus;
	createdAt: Date;
	processedAt?: Date;
	blocklists: BlocklistItem[];
}

export interface BlocklistItem {
	id: string;
	ipList: string[];
}

export interface ReportResponse {
	reports: ReportItem[];
}

export interface ReportRequest {
	name: string;
	targets: string[];
	blocklists: string[];
}
