import { $Enums } from '@prisma/client';

export interface ReportItem {
	id: string;
	name: string;
	cidr: string;
	status: $Enums.ReportStatus;
	createdAt: Date;
	processedAt?: Date;
	blocklists: BlocklistItem[];
}

export interface BlocklistItem {
	id: string;
	ipList: string[];
}
