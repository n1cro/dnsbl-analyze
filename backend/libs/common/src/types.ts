import { BlocklistItem } from './interfaces/report.interface';

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace PrismaJson {
		type Blocklist = BlocklistItem;
	}
}
