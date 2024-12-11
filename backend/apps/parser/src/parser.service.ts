import * as path from 'path';
import { Worker } from 'worker_threads';
import {
	Injectable,
	OnApplicationBootstrap,
	OnApplicationShutdown
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, fromEvent, merge, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

interface WorkerResponse {
	workerId: number;
	result: Record<string, string[]>;
	errors: number;
}

const WORKER_FILENAME = 'dnsbl.worker.js';

@Injectable()
export class ParserService implements OnApplicationBootstrap, OnApplicationShutdown {
	private workerPool: Worker[] = [];

	private dnsResolvers: string[];

	private messages$: Observable<WorkerResponse>;

	private numWorkers: number;

	constructor(private readonly configService: ConfigService) {
		this.dnsResolvers = this.configService.get('RESOLVERS').split(',');
		this.numWorkers = parseInt(this.configService.get('NUM_WORKERS'), 10) || 4;
	}

	onApplicationBootstrap() {
		for (let index = 0; index < this.numWorkers; index++) {
			const worker = new Worker(path.join(__dirname, WORKER_FILENAME), {
				env: { UV_THREADPOOL_SIZE: '8' }
			});
			this.workerPool.push(worker);
		}

		this.messages$ = merge(
			...this.workerPool.map(
				(worker) => fromEvent(worker, 'message') as Observable<WorkerResponse>
			)
		);
	}

	async onApplicationShutdown() {
		await Promise.all(this.workerPool.map((worker) => worker.terminate()));
	}

	async processCidr(cidr: string, blocklists: string[]) {
		const ips = this.generateIpRange(cidr);

		const chunkSize = Math.ceil(ips.length / this.numWorkers);
		const chunks = Array.from({ length: this.numWorkers }, (_, i) =>
			ips.slice(i * chunkSize, (i + 1) * chunkSize)
		);

		const resolversPerWorker = Math.floor(this.dnsResolvers.length / this.numWorkers);

		const workerResults = await Promise.all(
			chunks.map((chunk, index) => {
				const start = index * resolversPerWorker;
				const end = start + resolversPerWorker;
				const workerResolvers = this.dnsResolvers.slice(start, end);

				return this.callWorker(index, chunk, blocklists, workerResolvers);
			})
		);

		const combinedResult: Map<string, string[]> = new Map();
		let totalErrors = 0;

		for (const { result, errors } of workerResults) {
			totalErrors += errors;

			for (const [key, value] of Object.entries(result)) {
				if (!combinedResult.has(key)) {
					combinedResult.set(key, []);
				}
				combinedResult.get(key).push(...value);
			}
		}

		return { combinedResult, totalErrors };
	}

	private callWorker(
		workerIndex: number,
		chunk: string[],
		blocklists: string[],
		resolvers: string[]
	): Promise<WorkerResponse> {
		const worker = this.workerPool[workerIndex];
		if (!worker) {
			throw new Error('No available worker threads');
		}

		const taskId = workerIndex + 1;
		const data = { workerId: taskId, ips: chunk, blocklists, resolvers };

		worker.postMessage(data);

		return firstValueFrom(
			this.messages$.pipe(
				filter((message) => message.workerId === taskId),
				map((message) => message)
			)
		);
	}

	private generateIpRange(cidr: string): string[] {
		const [baseIp, prefixLength] = cidr.split('/');
		const baseParts = baseIp.split('.').map(Number);
		const hostsCount = 2 ** (32 - Number(prefixLength));

		const ips: string[] = [];
		for (let i = 0; i < hostsCount; i++) {
			const ip = [
				(baseParts[0] +
					Math.floor(
						(baseParts[1] + Math.floor((baseParts[2] + Math.floor(i / 256)) / 256)) / 256
					)) %
					256,
				(baseParts[1] + Math.floor((baseParts[2] + Math.floor(i / 256)) / 256)) % 256,
				(baseParts[2] + Math.floor(i / 256)) % 256,
				(baseParts[3] + i) % 256
			];

			ips.push(ip.join('.'));
		}
		return ips;
	}
}
