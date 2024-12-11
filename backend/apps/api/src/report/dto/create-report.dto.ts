import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { IsCidr } from '../../decorators/is-cidr.decorator';
import { DNSBL_SERVERS } from '@app/common';

export class CreateReportDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsCidr({ each: true })
	targets: string[];

	@IsIn(DNSBL_SERVERS, { each: true })
	blocklists: string[];
}
